import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

import { FlightsService } from '../flights.service';
import {
  FlightDivision,
  FlightInfo,
  FlightTeam,
  FlightTeamGolfer,
} from 'src/app/shared/flight.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { Season } from 'src/app/shared/season.model';
import { TeamCreateComponent } from 'src/app/teams/team-create/team-create.component';
import { SubstitutesSignupComponent } from './substitutes-signup/substitutes-signup.component';
import { FlightInfoComponent } from '../flight-home/flight-info/flight-info.component';
import { FlightTeamsComponent } from '../flight-home/flight-teams/flight-teams.component';
import { FlightDivisionsComponent } from '../flight-home/flight-divisions/flight-divisions.component';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/shared/user.model';
import { Golfer } from 'src/app/shared/golfer.model';
import { GolfersService } from 'src/app/golfers/golfers.service';

@Component({
  selector: 'app-flight-signup',
  templateUrl: './flight-signup.component.html',
  styleUrl: './flight-signup.component.css',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    ProgressSpinnerModule,
    TagModule,
    FlightInfoComponent,
    FlightDivisionsComponent,
    FlightTeamsComponent,
    TeamCreateComponent,
    SubstitutesSignupComponent,
  ],
})
export class FlightSignupComponent implements OnInit, OnDestroy {
  isLoading = true;

  currentDate = new Date();

  golfers!: Golfer[];
  private golfersSub: Subscription;
  private golfersService = inject(GolfersService);

  flights!: FlightInfo[];

  selectedFlight: FlightInfo | undefined;
  selectedFlightTeams: FlightTeam[] | undefined;
  selectedFlightSubstitutes: FlightTeamGolfer[] | undefined;
  selectedFlightDivisions: FlightDivision[] | undefined;

  private infoSub: Subscription;
  private teamsSub: Subscription;
  private substitutesSub: Subscription;
  private divisionsSub: Subscription;
  private flightsService = inject(FlightsService);

  season!: Season;

  private activeSeasonSub: Subscription;
  private seasonsService = inject(SeasonsService);

  isAuthenticated = false;
  currentUser: User | null = null;
  private userSub: Subscription;
  private authService = inject(AuthService);

  selectedTeam: FlightTeam | null = null;

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;
      }
    });

    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((result) => {
      this.golfers = result.sort((a: Golfer, b: Golfer) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });
    this.golfersService.getAllGolfers();

    this.infoSub = this.flightsService.getListUpdateListener().subscribe((result) => {
      this.flights = [...result];
      this.isLoading = false;
    });

    this.teamsSub = this.flightsService.getTeamsUpdateListener().subscribe((result) => {
      this.selectedFlightTeams = [...result];
    });

    this.substitutesSub = this.flightsService.getSubstitutesUpdateListener().subscribe((result) => {
      this.selectedFlightSubstitutes = [...result];
    });

    this.divisionsSub = this.flightsService.getDivisionsUpdateListener().subscribe((result) => {
      this.selectedFlightDivisions = [...result];
    });

    this.activeSeasonSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.season = result;
      this.flightsService.getList(result.year);
    });

    this.seasonsService.getActiveSeason();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.golfersSub.unsubscribe();
    this.infoSub.unsubscribe();
    this.teamsSub.unsubscribe();
    this.substitutesSub.unsubscribe();
    this.divisionsSub.unsubscribe();
    this.activeSeasonSub.unsubscribe();
  }

  getEarliestSignupDate(): Date {
    let d = this.flights[0].signup_start_date;
    for (const f of this.flights) {
      if (f.signup_start_date < d) {
        d = f.signup_start_date;
      }
    }
    return d;
  }

  isSignupOpen(info: FlightInfo): boolean {
    return this.currentDate >= info.signup_start_date && this.currentDate <= info.signup_stop_date;
  }

  getDaysUntilSignupStart(info: FlightInfo): number {
    const timeDiff = info.signup_start_date.getTime() - this.currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  getDaysUntilSignupStop(info: FlightInfo): number {
    const timeDiff = info.signup_stop_date.getTime() - this.currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  selectFlight(info: FlightInfo): void {
    if (!this.isSignupOpen(info) && !this.currentUser?.is_admin) {
      return;
    }
    this.selectedFlight = info;
    this.flightsService.getTeams(info.id);
    this.flightsService.getSubstitutes(info.id);
    this.flightsService.getDivisions(info.id);
  }

  handleTeamSelectionChange(team: FlightTeam | null): void {
    this.selectedTeam = team;
  }

  refreshSelectedFlightTeams(flightId: number): void {
    this.flightsService.getTeams(flightId);
    this.flightsService.getSubstitutes(flightId);
  }

  isUserAdmin(): boolean {
    if (!this.currentUser) {
      return false;
    }
    if (!this.currentUser.is_admin) {
      return false;
    }
    return this.currentUser.is_admin;
  }
}
