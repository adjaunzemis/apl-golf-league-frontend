import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../auth/auth.service';
import { FlightCreateComponent } from '../flights/flight-create/flight-create.component';
import { FlightsService } from '../flights/flights.service';
import { GolferCreateComponent } from '../golfers/golfer-create/golfer-create.component';
import { GolfersService } from '../golfers/golfers.service';
import { FlightInfo } from '../shared/flight.model';
import { Golfer, GolferAffiliation } from '../shared/golfer.model';
import { User } from '../shared/user.model';
import { SignupComponent } from '../signup/signup.component';
import { TournamentCreateComponent } from '../tournaments/tournament-create/tournament-create.component';
import { TournamentsService } from '../tournaments/tournaments.service';
import { TournamentInfo } from '../shared/tournament.model';
import { environment } from 'src/environments/environment';
import { SeasonsService } from '../seasons/seasons.service';
import { Season } from '../shared/season.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [SignupComponent],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = environment.title;

  isAuthenticated = false;
  private userSub: Subscription;
  currentUser: User | null = null;

  activeSeason: Season;
  private seasonsSub: Subscription;

  golferNameOptions: string[] = [];
  private golfersSub: Subscription;

  flights: FlightInfo[] = [];
  private flightsSub: Subscription;

  tournaments: TournamentInfo[] = [];
  private tournamentsSub: Subscription;

  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private golfersService: GolfersService,
    private flightsService: FlightsService,
    private seasonsService: SeasonsService,
    private tournamentsService: TournamentsService,
    private signupComponent: SignupComponent,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'User',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-sign-in',
            route: '/auth/login',
          },
          {
            label: 'Profile',
            icon: 'pi pi-user',
            route: '/auth/user',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            callback: () => this.onLogout(),
          },
        ],
      },
      {
        label: 'Sign-Ups',
        icon: 'pi pi-user-plus',
        route: '/signup',
      },
      {
        label: 'Pay Dues',
        icon: 'pi pi-dollar',
        callback: () => this.onPayDues(),
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
        items: [
          {
            label: 'Golfers',
            icon: 'pi pi-users',
            route: '/golfer/search',
          },
          {
            label: 'Courses',
            icon: 'pi pi-home',
            route: '/courses',
          },
        ],
      },
      {
        label: 'Post Scores',
        icon: 'pi pi-pen-to-square',
        items: [
          {
            label: 'Flight Match',
            icon: 'pi pi-venus',
            route: '/flight-match/edit',
          },
          {
            label: 'Tournament Scores',
            icon: 'pi pi-trophy',
            route: '/tournament/scores',
          },
        ],
      },
      {
        label: 'Rules',
        icon: 'pi pi-clipboard',
        items: [
          {
            label: 'League Rules',
            icon: 'pi pi-file-edit',
            route: '/rules',
          },
          {
            label: 'League By-Laws',
            icon: 'pi pi-exclamation-triangle',
            route: '/bylaws',
          },
          {
            label: 'Participation Agreement',
            icon: 'pi pi-download',
            route: '/rules',
          },
        ],
      },
      {
        label: 'Admin',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Add Golfer',
            icon: 'pi pi-user-plus',
            callback: () => this.onAddNewGolfer(),
          },
          {
            label: 'Qualifying Scores',
            icon: 'pi pi-venus',
            route: '/golfer/qualifying',
          },
          {
            label: 'Add Course',
            icon: 'pi pi-home',
            route: '/courses/edit',
          },
          {
            label: 'Add Flight',
            icon: 'pi pi-plus',
            callback: () => this.onAddNewFlight(),
          },
          {
            label: 'Add Tournament',
            icon: 'pi pi-plus',
            callback: () => this.onAddNewTournament(),
          },
          {
            label: 'Treasury',
            icon: 'pi pi-dollar',
            items: [
              {
                label: 'League Dues',
                route: '/dues-payments',
              },
              {
                label: 'Tournaments',
                items: [
                  {
                    label: 'TODO',
                    route: '/',
                  },
                ],
              },
            ],
          },
          {
            label: 'Manage Users',
            icon: 'pi pi-users',
            route: '/auth/manage',
          },
        ],
      },
      {
        label: 'Legacy Website',
        icon: 'pi pi-history',
        url: 'http://aplgolfleague.com/cgi-bin/golf_cgi/aplgolf.pl',
      },
    ];

    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;
      }
    });

    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((result) => {
      const golferOptions = result.sort((a: Golfer, b: Golfer) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.golferNameOptions = golferOptions.map((golfer) => golfer.name);
    });

    this.flightsSub = this.flightsService.getFlightsListUpdateListener().subscribe((result) => {
      this.flights = result.flights;
    });

    this.tournamentsSub = this.tournamentsService
      .getTournamentsListUpdateListener()
      .subscribe((result) => {
        this.tournaments = result.tournaments;
      });

    this.golfersService.getAllGolfers();

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      console.log(`[HeaderComponent] Received active season: year=${result.year}`);
      this.activeSeason = result;
      this.flightsService.getFlightsList(this.activeSeason.year);
      this.tournamentsService.getTournamentsList(this.activeSeason.year);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.golfersSub.unsubscribe();
    this.flightsSub.unsubscribe();
    this.seasonsSub.unsubscribe();
    this.tournamentsSub.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
    this.currentUser = null;
  }

  onPayDues(): void {
    this.signupComponent.onPayDues();
  }

  onPayEntryFees(): void {
    this.signupComponent.onPayEntryFees();
  }

  // TODO: Consolidate `onAddNewGolfer()` usage from header, signups
  // TODO: Move to admin view?
  onAddNewGolfer(): void {
    const dialogRef = this.dialog.open(GolferCreateComponent, {
      width: '300px',
      data: {
        name: '',
        affiliation: GolferAffiliation.APL_EMPLOYEE,
        email: '',
        phone: '',
      },
    });

    dialogRef.afterClosed().subscribe((golferData) => {
      if (golferData !== null && golferData !== undefined) {
        const golferNameOptionsLowercase = this.golferNameOptions.map((name) => name.toLowerCase());
        if (golferNameOptionsLowercase.includes(golferData.name.toLowerCase())) {
          this.snackBar.open(`Golfer with name '${golferData.name}' already exists!`, undefined, {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
          return;
        }

        this.golfersService
          .createGolfer(
            golferData.name,
            golferData.affiliation,
            golferData.email !== '' ? golferData.email : null,
            golferData.phone !== '' ? golferData.phone : null,
          )
          .subscribe((result) => {
            console.log(`[HeaderComponent] Successfully added golfer: ${result.name}`);
            this.snackBar.open(`Successfully added golfer: ${result.name}`, undefined, {
              duration: 5000,
              panelClass: ['success-snackbar'],
            });

            this.golfersService.getAllGolfers(); // refresh golfer name options
          });
      }
    });
  }

  // TODO: Move to admin view?
  // TODO: Conslidate with flight-home onManageFlight
  onAddNewFlight(): void {
    const dialogRef = this.dialog.open(FlightCreateComponent, {
      width: '900px',
      data: {
        year: this.activeSeason.year,
        weeks: 18, // typical season length
        divisions: [
          {
            name: 'Middle',
            gender: "Men's",
          },
          {
            name: 'Senior',
            gender: "Men's",
          },
          {
            name: 'Super-Senior',
            gender: "Men's",
          },
          {
            name: 'Forward',
            gender: "Ladies'",
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((flightData) => {
      if (flightData !== null && flightData !== undefined) {
        const existingFlights = this.flights.filter((f) => f.year == flightData.year);
        const existingFlightNames = existingFlights.map((f) => f.name.toLowerCase());
        if (existingFlightNames.includes(flightData.name.toLowerCase())) {
          this.snackBar.open(
            `Flight with name '${flightData.name}' and year '${flightData.year}' already exists!`,
            undefined,
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            },
          );
          // TODO: re-open dialog window to edit selections
          return;
        }

        console.log(flightData);
        this.flightsService.createFlight(flightData).subscribe((result) => {
          console.log(
            `[HeaderComponent] Successfully created flight: ${result.name} (${result.year})`,
          );
          this.snackBar.open(
            `Successfully created flight: ${result.name} (${result.year})`,
            undefined,
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
            },
          );

          this.flightsService.getFlightsList(this.activeSeason.year); // refresh flights list
        });
      }
    });
  }

  // TODO: Move to admin view?
  onAddNewTournament(): void {
    const dialogRef = this.dialog.open(TournamentCreateComponent, {
      width: '900px',
      data: {
        year: this.activeSeason.year,
        bestball: 0,
        shotgun: 0,
        strokeplay: 0,
        scramble: 0,
        individual: 0,
        ryder_cup: 0,
        chachacha: 0,
        divisions: [
          {
            name: 'Middle',
            gender: "Men's",
          },
          {
            name: 'Senior',
            gender: "Men's",
          },
          {
            name: 'Super-Senior',
            gender: "Men's",
          },
          {
            name: 'Forward',
            gender: "Ladies'",
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((tournamentData) => {
      if (tournamentData !== null && tournamentData !== undefined) {
        const existingTournaments = this.tournaments.filter((t) => t.year == tournamentData.year);
        const existingTournamentNames = existingTournaments.map((t) => t.name.toLowerCase());
        if (existingTournamentNames.includes(tournamentData.name.toLowerCase())) {
          this.snackBar.open(
            `Tournament with name '${tournamentData.name}' and year '${tournamentData.year}' already exists!`,
            undefined,
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            },
          );
          // TODO: re-open dialog window to edit selections
          return;
        }

        console.log(tournamentData);
        // TODO: Implement tournament creation in service
        this.tournamentsService.createTournament(tournamentData).subscribe((result) => {
          console.log(
            `[HeaderComponent] Successfully created tournament: ${result.name} (${result.year})`,
          );
          this.snackBar.open(
            `Successfully created tournament: ${result.name} (${result.year})`,
            undefined,
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
            },
          );

          this.tournamentsService.getTournamentsList(this.activeSeason.year); // refresh tournaments list
        });
      }
    });
  }
}
