import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';

import { FlightData, FlightInfo } from '../shared/flight.model';
import { FlightsService } from '../flights/flights.service';
import { TournamentData, TournamentInfo } from '../shared/tournament.model';
import { TournamentsService } from '../tournaments/tournaments.service';
import { TeamData } from '../shared/team.model';
import { TeamCreate } from './../shared/team.model';
import { TeamCreateComponent } from './team-create.component';
import { AppConfigService } from '../app-config.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  private currentYear: number;
  currentDate = new Date();

  isAuthenticated = false;
  private userSub: Subscription;
  currentUser: User | null = null;

  selectedTabIdx = 0; // 0 = 'flight', 1 = 'tournament' TODO: use enum?

  isLoadingFlights = true;
  isLoadingTournaments = true;

  isLoadingSelectedFlightOrTournament = false;
  isSelectedSignupWindowOpen = false;

  flightControl = new FormControl('', Validators.required);
  tournamentControl = new FormControl('', Validators.required);

  private flightsSub: Subscription;
  flights: FlightInfo[] = [];
  private selectedFlightSub: Subscription;

  private tournamentsSub: Subscription;
  tournaments: TournamentInfo[] = [];
  private selectedTournamentSub: Subscription;

  selectedFlightOrTournament: FlightData | TournamentData | undefined;

  constructor(private appConfigService: AppConfigService, private authService: AuthService, private flightsService: FlightsService, private tournamentsService: TournamentsService, private dialog: MatDialog, private route: ActivatedRoute) { }

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
      });

    this.selectedFlightSub = this.flightsService.getFlightUpdateListener()
      .subscribe(result => {
        this.selectedFlightOrTournament = result;
        this.isLoadingSelectedFlightOrTournament = false;

        this.isSelectedSignupWindowOpen = this.selectedFlightOrTournament.signup_start_date <= this.currentDate && this.selectedFlightOrTournament.signup_stop_date >= this.currentDate;
      });

    this.flightsService.getFlightsList(this.currentYear);

    this.tournamentsSub = this.tournamentsService.getTournamentsListUpdateListener()
      .subscribe(result => {
        this.tournaments = result.tournaments;
        this.isLoadingTournaments = false;
      });

    this.selectedTournamentSub = this.tournamentsService.getTournamentUpdateListener()
      .subscribe(result => {
        this.selectedFlightOrTournament = result;
        this.isLoadingSelectedFlightOrTournament = false;

        this.isSelectedSignupWindowOpen = this.selectedFlightOrTournament.signup_start_date <= this.currentDate && this.selectedFlightOrTournament.signup_stop_date >= this.currentDate;
      });

    this.tournamentsService.getTournamentsList(this.currentYear);

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.type) {
          this.setSelectedTabIdxByType(params.type);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.flightsSub.unsubscribe();
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
    console.log(`[SignupComponent] Selected tab ${this.selectedTabIdx} for type '${type}'`)
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

  getFlightStartOrTournamentDate(): Date {
    if (this.selectedTabIdx === 0) {
      const selectedFlight = this.selectedFlightOrTournament as FlightData;
      return selectedFlight.start_date;
    } else {
      const selectedTournament = this.selectedFlightOrTournament as TournamentData;
      return selectedTournament.date;
    }
  }

  getFlightStartOrTournamentDateLabel(): string {
    if (this.selectedTabIdx === 0) {
      return "Start Date";
    } else {
      return "Tournament Date";
    }
  }

  getSelectedFlightOrTournamentTeams(): TeamData[] {
    if (this.selectedFlightOrTournament) {
      if (this.selectedTabIdx === 0) {
        const selectedFlight = this.selectedFlightOrTournament as FlightData;
        if (!selectedFlight.teams) {
          return []
        }
        return selectedFlight.teams;
      } else {
        const selectedTournament = this.selectedFlightOrTournament as TournamentData;
        if (!selectedTournament.teams) {
          return []
        }
        // return selectedTournament.teams;
        return []; // TODO: Map tournament team data to TeamData[]
      }
    }
    return [];
  }

  onAddNewTeam(): void {
    // TODO: Adapt for modifying existing teams (pass info into dialog)
    const dialogRef = this.dialog.open(TeamCreateComponent, {
      width: '750px',
      data: {
        name: '',
        divisions: this.selectedFlightOrTournament?.divisions
      }
    });

    dialogRef.afterClosed().subscribe((teamData: TeamCreate) => {
      if (teamData !== null && teamData !== undefined && this.selectedFlightOrTournament !== undefined) {
        // Submit new team signup
        let teamGolferSignupData : { golfer_id: number, golfer_name: string, division_id: number, role: string }[] = [];

        for (const teamGolfer of teamData.golfers) {
          teamGolferSignupData.push({
            golfer_id: teamGolfer.golfer.id,
            golfer_name: teamGolfer.golfer.name,
            division_id: teamGolfer.division.id,
            role: teamGolfer.role
          });
        }

        if (this.selectedTabIdx === 0) { // flight sign-ups
          this.isLoadingSelectedFlightOrTournament = true;
          this.flightsService.createTeam(teamData.name, this.selectedFlightOrTournament.id, teamGolferSignupData).subscribe(
            team => {
              console.log(`[SignupComponent] Created team '${team.name}' (id=${team.id}) for flight '${this.selectedFlightOrTournament?.name} (${this.selectedFlightOrTournament?.year})'`);
              if (this.selectedFlightOrTournament) {
                this.getSelectedFlightData(this.selectedFlightOrTournament.id); // refresh flight info to get updated team in list
              }
            },
            error => {
              // TODO: add ErrorDialogComponent?
              console.error(`Unable to create team '${teamData.name}' for flight '${this.selectedFlightOrTournament?.name} (${this.selectedFlightOrTournament?.year})'`);
              this.isLoadingSelectedFlightOrTournament = false;
            }
          );
        } else if (this.selectedTabIdx === 1) { // tournament sign-ups
          this.isLoadingSelectedFlightOrTournament = true;
          this.tournamentsService.createTeam(teamData.name, this.selectedFlightOrTournament.id, teamGolferSignupData).subscribe(
            team => {
              console.log(`[SignupComponent] Created team '${team.name}' (id=${team.id}) for tournament '${this.selectedFlightOrTournament?.name} (${this.selectedFlightOrTournament?.year})'`);
              if (this.selectedFlightOrTournament) {
                this.getSelectedTournamentData(this.selectedFlightOrTournament.id); // refresh tournament info to get updated team
              }
            },
            error => {
              // TODO: add ErrorDialogComponent?
              console.error(`Unable to create team '${teamData.name}' for tournament '${this.selectedFlightOrTournament?.name} (${this.selectedFlightOrTournament?.year})'`);
              this.isLoadingSelectedFlightOrTournament = false;
            }
          );
        } else {
          // TODO: add ErrorDialogComponent?
          console.error(`[SignupComponent] Invalid selected tab index: ${this.selectedTabIdx}`)
        }
      }
    });
  }

}
