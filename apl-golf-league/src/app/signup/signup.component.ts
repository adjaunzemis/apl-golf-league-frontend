import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';

import { FlightData, FlightInfo } from '../shared/flight.model';
import { FlightsService } from '../flights/flights.service';
import { TournamentData, TournamentInfo } from '../shared/tournament.model';
import { TournamentsService } from '../tournaments/tournaments.service';
import { TeamsService } from '../teams/teams.service';
import { Golfer, TeamGolferData } from '../shared/golfer.model';
import { DivisionData } from '../shared/division.model';
import { GolfersService } from '../golfers/golfers.service';
import { TeamInfo } from '../shared/team.model';
import { TeamCreate, TeamGolferCreate } from './../shared/team.model';
import { TeamCreateComponent } from './team-create.component';
import { AppConfigService } from '../app-config.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../shared/user.model';
import { LeagueDuesPaymentComponent } from '../payments/league-dues-payment/league-dues-payment.component';
import { TournamentEntryFeesPaymentComponent } from '../payments/tournament-entry-fees-payment/tournament-entry-fees-payment.component';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    standalone: false
})
export class SignupComponent implements OnInit, OnDestroy {
  private currentYear: number;
  currentDate = new Date();

  isAuthenticated = false;
  private userSub: Subscription;
  currentUser: User | null = null;

  selectedTabIdx = 0; // 0 = 'flight', 1 = 'tournament' TODO: use enum?

  initFlightId: number;
  initTournamentId: number;

  isLoadingFlights = true;
  isLoadingTournaments = true;
  isLoadingGolfers = true;

  isLoadingSelectedFlightOrTournament = false;
  isSelectedSignupWindowOpen = false;

  flightControl = new UntypedFormControl('', Validators.required);
  tournamentControl = new UntypedFormControl('', Validators.required);

  private flightsSub: Subscription;
  flights: FlightInfo[] = [];
  private selectedFlightSub: Subscription;

  private tournamentsSub: Subscription;
  tournaments: TournamentInfo[] = [];
  private selectedTournamentSub: Subscription;

  private golfersSub: Subscription;
  golfers: Golfer[] = [];

  selectedFlightOrTournament: FlightData | TournamentData | undefined;

  constructor(private appConfigService: AppConfigService, private authService: AuthService, private flightsService: FlightsService, private tournamentsService: TournamentsService, private teamsService: TeamsService, private golfersService: GolfersService, private snackBar: MatSnackBar, private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentYear = this.appConfigService.currentYear;

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;
      }
    });

    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
        this.flights = result.flights;
        this.isLoadingFlights = false;

        if (this.initFlightId) {
          for (const flight of this.flights) {
            if (flight.id == this.initFlightId) {
              this.flightControl.setValue(flight);
              this.getSelectedFlightData(this.initFlightId);
            }
          }
        }
      });

    this.selectedFlightSub = this.flightsService.getFlightUpdateListener()
      .subscribe(result => {
        this.selectedFlightOrTournament = result;
        this.isLoadingSelectedFlightOrTournament = false;

        this.isSelectedSignupWindowOpen = this.selectedFlightOrTournament.signup_start_date <= this.currentDate && this.selectedFlightOrTournament.signup_stop_date >= this.currentDate;
      });

    this.tournamentsSub = this.tournamentsService.getTournamentsListUpdateListener()
      .subscribe(result => {
        this.tournaments = result.tournaments;
        this.isLoadingTournaments = false;

        if (this.initTournamentId) {
          for (const tournament of this.tournaments) {
            if (tournament.id == this.initTournamentId) {
              this.tournamentControl.setValue(tournament);
              this.getSelectedTournamentData(this.initTournamentId);
            }
          }
        }
      });

    this.selectedTournamentSub = this.tournamentsService.getTournamentUpdateListener()
      .subscribe(result => {
        this.selectedFlightOrTournament = result;
        this.isLoadingSelectedFlightOrTournament = false;

        this.isSelectedSignupWindowOpen = this.selectedFlightOrTournament.signup_start_date <= this.currentDate && this.selectedFlightOrTournament.signup_stop_date >= this.currentDate;
      });


    this.golfersSub = this.golfersService.getAllGolfersUpdateListener()
      .subscribe(result => {
        this.golfers = result;
        this.isLoadingGolfers = false;
      });

    this.golfersService.getAllGolfers();

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.type) {
          this.setSelectedTabIdxByType(params.type);
          if (params.id) {
            if (this.selectedTabIdx === 0) { // flight
              this.initFlightId = params.id;
            } else { // tournament
              this.initTournamentId = params.id;
            }
          }
        }
      }
      this.flightsService.getFlightsList(this.currentYear);
      this.tournamentsService.getTournamentsList(this.currentYear);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.flightsSub.unsubscribe();
    this.golfersSub.unsubscribe();
    this.selectedFlightSub.unsubscribe();
    this.tournamentsSub.unsubscribe();
    this.selectedTournamentSub.unsubscribe();
  }

  private setSelectedTabIdxByType(type: string): void {
    if ((type.toLowerCase() === "tournament") || (type.toLowerCase() === "tournaments")) {
      this.selectedTabIdx = 1;
    } else {
      this.selectedTabIdx = 0;
    }
    this.onTabIndexChanged(this.selectedTabIdx);
  }

  onTabIndexChanged(tabIdx: number): void {
    this.flightControl.setValue("--");
    this.tournamentControl.setValue("--");
    this.selectedFlightOrTournament = undefined;
  }

  getSelectedFlightData(id: number): void {
    this.isLoadingSelectedFlightOrTournament = true;
    this.flightsService.getFlight(id);
  }

  getSelectedTournamentData(id: number): void {
    this.isLoadingSelectedFlightOrTournament = true;
    this.tournamentsService.getTournament(id);
  }

  getDaysUntilSignup(): number {
    if (!this.selectedFlightOrTournament) {
      return 0;
    }
    return Math.floor((Date.UTC(this.selectedFlightOrTournament.signup_start_date.getFullYear(), this.selectedFlightOrTournament.signup_start_date.getMonth(), this.selectedFlightOrTournament.signup_start_date.getDate()) - Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  getFlightTeeTimes(): string | undefined {
    if (this.selectedTabIdx === 0) { // flight
      const selectedFlight = this.selectedFlightOrTournament as FlightData;
      return selectedFlight.tee_times;
    }
    return undefined;
  }

  getFlightStartOrTournamentDate(): Date {
    if (this.selectedTabIdx === 0) { // flight
      const selectedFlight = this.selectedFlightOrTournament as FlightData;
      return selectedFlight.start_date;
    } else { // tournament
      const selectedTournament = this.selectedFlightOrTournament as TournamentData;
      return selectedTournament.date;
    }
  }

  getFlightStartOrTournamentDateLabel(): string {
    if (this.selectedTabIdx === 0) { // flight
      return "Start Date";
    } else { // tournament
      return "Tournament Date";
    }
  }

  getSelectedFlightOrTournamentTeams(): TeamInfo[] {
    if (this.selectedFlightOrTournament?.teams) {
      return this.selectedFlightOrTournament.teams;
    }
    return [];
  }

  onCreateTeam(): void {
    this.createOrUpdateTeam();
  }

  onUpdateTeam(team: TeamInfo) {
    if (this.isSelectedSignupWindowOpen || (this.isAuthenticated && this.currentUser?.is_admin)) {
      this.createOrUpdateTeam(team);
    }
  }

  private convertTeamCreateToTeamInfo(teamCreate: TeamCreate): TeamInfo {
    let golfers: TeamGolferData[] = [];
    for (const golfer of teamCreate.golfers) {
      golfers.push({
        golfer_id: golfer.golfer.id,
        golfer_name: golfer.golfer.name,
        division_id: golfer.division.id,
        division_name: golfer.division.name,
        role: golfer.role,
        team_id: teamCreate.id ? teamCreate.id : -1, // TODO: refactor placeholder
        team_name: teamCreate.name,
        year: -1 // TODO: refactor placeholder
      });
    }
    return {
      id: teamCreate.id,
      name: teamCreate.name,
      golfers: golfers
    };
  }

  private createOrUpdateTeam(initTeam?: TeamInfo): void {
    if (!this.selectedFlightOrTournament) {
      return // TODO: refactor?
    }

    // Modify existing team
    let initTeamId = -1;
    let initTeamName = "";
    let initTeamGolfers: TeamGolferCreate[] = [];
    if (initTeam) {
      if (initTeam.id) {
        initTeamId = initTeam.id;
      }
      initTeamName = initTeam.name;

      for (const initTeamGolfer of initTeam.golfers) {
        let golfer: Golfer | null = null;
        for (const g of this.golfers) {
          if (g.id == initTeamGolfer.golfer_id) {
            golfer = g;
            break;
          }
        }

        let division: DivisionData | null = null;
        for (const d of this.selectedFlightOrTournament?.divisions) {
          if (d.id == initTeamGolfer.division_id) {
            division = d;
            break;
          }
        }

        if (golfer && division) {
          initTeamGolfers.push({
            golfer: golfer,
            role: initTeamGolfer.role,
            division: division
          });
        }
      }
    }

    // Only allow substitute sign-ups for flight teams and for flight-edit or admin users
    const allowSubstitutes = (this.selectedTabIdx === 0) && this.isAuthenticated && (this.currentUser?.edit_flights || this.currentUser?.is_admin);

    const dialogRef = this.dialog.open(TeamCreateComponent, {
      width: '750px',
      data: {
        teamId: initTeamId,
        teamName: initTeamName,
        teamGolfers: initTeamGolfers,
        divisions: this.selectedFlightOrTournament?.divisions,
        allowSubstitutes: allowSubstitutes
      }
    });

    // Submit team signup (create or update)
    dialogRef.afterClosed().subscribe((teamData: TeamCreate) => {
      if (teamData !== null && teamData !== undefined && this.selectedFlightOrTournament !== undefined) {
        let flightTournamentStr = "";
        if (this.selectedTabIdx === 0) { // flight
          flightTournamentStr = "flight";
          teamData.flight_id = this.selectedFlightOrTournament.id;
        }
        else if (this.selectedTabIdx === 1) { // tournament
          flightTournamentStr = "tournament";
          teamData.tournament_id = this.selectedFlightOrTournament.id;
        }

        this.isLoadingSelectedFlightOrTournament = true;
        if (teamData.id) { // update existing team
          this.teamsService.updateTeam(teamData).subscribe(
            team => {
              console.log(`[SignupComponent] Updated team '${team.name}' (id=${team.id}) for ${flightTournamentStr} '${this.selectedFlightOrTournament?.name} (${this.selectedFlightOrTournament?.year})'`);
              this.snackBar.open(`Updated team '${team.name}'`, undefined, {
                duration: 5000,
                panelClass: ['success-snackbar']
              });

              if (this.selectedFlightOrTournament) {
                if (this.selectedTabIdx === 0) {
                  this.getSelectedFlightData(this.selectedFlightOrTournament.id); // refresh flight info to get updated team in list
                }
                else {
                  this.getSelectedTournamentData(this.selectedFlightOrTournament.id); // refresh tournament info to get updated team in list
                }
              }
            },
            error => {
              console.error(`[SignupComponent] Unable to update team '${teamData.name}' (id=${teamData.id}) for ${flightTournamentStr} '${this.selectedFlightOrTournament?.name} (${this.selectedFlightOrTournament?.year})'`);
              this.isLoadingSelectedFlightOrTournament = false;

              // Re-open team edit dialog to allow retrying
              this.createOrUpdateTeam(this.convertTeamCreateToTeamInfo(teamData));
            }
          )
        } else { // create new team
          this.teamsService.createTeam(teamData).subscribe(
            team => {
              console.log(`[SignupComponent] Created team '${team.name}' (id=${team.id}) for ${flightTournamentStr} '${this.selectedFlightOrTournament?.name} (${this.selectedFlightOrTournament?.year})'`);
              this.snackBar.open(`Created team '${team.name}'`, undefined, {
                duration: 5000,
                panelClass: ['success-snackbar']
              });

              if (this.selectedFlightOrTournament) {
                if (this.selectedTabIdx === 0) {
                  this.getSelectedFlightData(this.selectedFlightOrTournament.id); // refresh flight info to get updated team in list
                }
                else {
                  this.getSelectedTournamentData(this.selectedFlightOrTournament.id); // refresh tournament info to get updated team in list
                }
              }
            },
            error => {
              console.error(`[SignupComponent] Unable to create team '${teamData.name}' for ${flightTournamentStr} '${this.selectedFlightOrTournament?.name} (${this.selectedFlightOrTournament?.year})'`);
              this.isLoadingSelectedFlightOrTournament = false;

              // Re-open team edit dialog to allow retrying
              this.createOrUpdateTeam(this.convertTeamCreateToTeamInfo(teamData));
            }
          );
        }
      }
    });
  }

  onPayDues(): void {
    const dialogRef = this.dialog.open(LeagueDuesPaymentComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((paymentSuccessful) => {
      if (paymentSuccessful) {
        // Reload selected flight/tournament to capture updated dues statuses
        if (this.selectedFlightOrTournament) {
          if (this.selectedTabIdx === 0) {
            this.getSelectedFlightData(this.selectedFlightOrTournament.id); // refresh flight info to get updated team in list
          }
          else {
            this.getSelectedTournamentData(this.selectedFlightOrTournament.id); // refresh tournament info to get updated team in list
          }
        }
      }
    });
  }

  onPayEntryFees(): void {
    if (this.selectedTabIdx === 1) {
      const selectedTournament = (this.selectedFlightOrTournament as TournamentData);
      const dialogRef = this.dialog.open(TournamentEntryFeesPaymentComponent, {
        width: '600px',
        data: {
          tournamentId: selectedTournament.id
        }
      });

      dialogRef.afterClosed().subscribe((paymentSuccessful) => {
        if (paymentSuccessful) {
          // Reload selected tournament to capture updated fees statuses
          if (this.selectedFlightOrTournament) {
            this.getSelectedTournamentData(this.selectedFlightOrTournament.id); // refresh tournament info to get updated team in list
          }
        }
      });
    }
  }

}
