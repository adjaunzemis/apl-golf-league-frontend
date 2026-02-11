import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notifications/notification.service';
import { FlightsService } from '../flights/flights.service';
import { FlightInfo } from '../shared/flight.model';
import { User } from '../shared/user.model';
import { TournamentsService } from '../tournaments/tournaments.service';
import { TournamentInfo } from '../shared/tournament.model';
import { environment } from 'src/environments/environment';
import { SeasonsService } from '../seasons/seasons.service';
import { Season } from '../shared/season.model';
import { TeamCreateComponent } from '../teams/team-create/team-create.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [TeamCreateComponent, DialogService],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = environment.title;
  maintenance = environment.maintenance;

  isAuthenticated = false;
  private userSub: Subscription;
  currentUser: User | null = null;

  activeSeason: Season;
  private activeSeasonSub: Subscription;

  flights: FlightInfo[] = [];
  private flightsSub: Subscription;

  tournaments: TournamentInfo[] = [];
  private tournamentsSub: Subscription;

  items: MenuItem[] | undefined;

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private flightsService = inject(FlightsService);
  private seasonsService = inject(SeasonsService);
  private tournamentsService = inject(TournamentsService);
  private teamCreateComponent = inject(TeamCreateComponent);

  ngOnInit(): void {
    if (this.maintenance) {
      return;
    }

    this.updateMenuItems();

    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;
      this.currentUser = user;
      this.updateMenuItems();
    });

    this.flightsSub = this.flightsService.getListUpdateListener().subscribe((result) => {
      this.flights = result;
    });

    this.tournamentsSub = this.tournamentsService.getListUpdateListener().subscribe((result) => {
      this.tournaments = result;
    });

    this.activeSeasonSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      console.log(`[HeaderComponent] Received active season: year=${result.year}`);
      this.activeSeason = result;
      this.flightsService.getList(this.activeSeason.year);
      this.tournamentsService.getList(this.activeSeason.year);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.flightsSub.unsubscribe();
    this.activeSeasonSub.unsubscribe();
    this.tournamentsSub.unsubscribe();
  }

  updateMenuItems(): void {
    this.items = [
      {
        label: 'Search',
        icon: 'pi pi-search',
        visible: true,
        items: [
          {
            label: 'Golfers',
            icon: 'pi pi-users',
            visible: true,
            route: '/golfer-search',
          },
          {
            label: 'Courses',
            icon: 'pi pi-home',
            visible: this.currentUser?.is_admin,
            route: '/courses',
          },
        ],
      },
      {
        label: 'Sign-Ups',
        icon: 'pi pi-clipboard',
        visible: true,
        items: [
          {
            label: 'Register Golfer',
            icon: 'pi pi-user-plus',
            visible: true,
            callback: () => this.teamCreateComponent.onRegisterGolfer(),
          },
          {
            label: 'Flights',
            icon: 'pi pi-venus',
            visible: true,
            route: '/flight-signup',
          },
          {
            label: 'Tournaments',
            icon: 'pi pi-trophy',
            visible: true,
            route: '/tournament-signup',
          },
        ],
      },
      {
        label: 'Payments',
        icon: 'pi pi-dollar',
        visible: true,
        items: [
          {
            label: 'League Dues',
            icon: 'pi pi-venus',
            visible: true,
            // callback: () => this.onPayDues(),
          },
          {
            label: 'Entry Fees',
            icon: 'pi pi-trophy',
            visible: true,
            // callback: () => this.onPayEntryFees(),
          },
        ],
      },
      {
        label: 'Scorecards',
        icon: 'pi pi-pen-to-square',
        visible: true,
        items: [
          {
            label: 'Flight Match',
            icon: 'pi pi-venus',
            visible: true,
            route: '/flight-scorecard',
          },
          {
            label: 'Post Flight Scores',
            icon: 'pi pi-pen-to-square',
            visible: this.currentUser?.is_admin || this.currentUser?.edit_flights,
            route: '/flight-scorecard/edit',
          },
          {
            label: 'Post Tournament Scores',
            icon: 'pi pi-pen-to-square',
            visible: this.currentUser?.is_admin || this.currentUser?.edit_tournaments,
            route: '/tournament/scores',
          },
        ],
      },
      {
        label: 'Legacy Website',
        icon: 'pi pi-history',
        visible: true,
        url: 'http://aplgolfleague.com/cgi-bin/golf_cgi/aplgolf.pl',
      },
      {
        label: 'Admin',
        icon: 'pi pi-cog',
        visible:
          this.currentUser?.is_admin ||
          this.currentUser?.edit_flights ||
          this.currentUser?.edit_tournaments ||
          this.currentUser?.edit_payments,
        items: [
          {
            label: 'Qualifying Scores',
            icon: 'pi pi-venus',
            visible: this.currentUser?.is_admin,
            route: '/golfer/qualifying',
          },
          {
            label: 'Add Course',
            icon: 'pi pi-plus',
            visible: this.currentUser?.is_admin,
            route: '/courses/edit',
          },
          // {
          //   label: 'Add Flight',
          //   icon: 'pi pi-plus',
          //   visible: this.currentUser?.is_admin,
          //   callback: () => this.onAddNewFlight(),
          // },
          // {
          //   label: 'Add Tournament',
          //   icon: 'pi pi-plus',
          //   visible: this.currentUser?.is_admin,
          //   callback: () => this.onAddNewTournament(),
          // },
          {
            label: 'Treasury',
            icon: 'pi pi-dollar',
            visible: this.currentUser?.is_admin || this.currentUser?.edit_payments,
            items: [
              {
                label: 'League Dues',
                icon: 'pi pi-venus',
                visible: this.currentUser?.is_admin || this.currentUser?.edit_payments,
                route: '/dues-payments',
              },
              {
                label: 'Tournaments',
                icon: 'pi pi-trophy',
                visible: this.currentUser?.is_admin || this.currentUser?.edit_payments,
                route: '/fee-payments',
              },
            ],
          },
          {
            label: 'Manage Users',
            icon: 'pi pi-users',
            visible: this.currentUser?.is_admin,
            route: '/auth/manage',
          },
        ],
      },
    ];
  }

  onLogout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.updateMenuItems();
  }

  // onPayDues(): void {
  //   this.signupComponent.onPayDues();
  // }

  // onPayEntryFees(): void {
  //   this.signupComponent.onPayEntryFees();
  // }
}
