import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { TournamentsService } from '../tournaments.service';
import {
  TournamentDivision,
  TournamentInfo,
  TournamentTeam,
  TournamentFreeAgentGolfer,
} from 'src/app/shared/tournament.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { Season } from 'src/app/shared/season.model';
import { Golfer } from 'src/app/shared/golfer.model';
import { GolfersService } from 'src/app/golfers/golfers.service';
import { User } from 'src/app/shared/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { TournamentInfoComponent } from '../tournament-home/tournament-info/tournament-info.component';
import { TournamentTeamsComponent } from '../tournament-home/tournament-teams/tournament-teams.component';
import { TournamentDivisionsComponent } from '../tournament-home/tournament-divisions/tournament-divisions.component';
import { TournamentTeamCreateComponent } from 'src/app/teams/tournament-team-create/tournament-team-create.component';
import { FreeAgentsSignupComponent } from 'src/app/flights/flight-signup/free-agents-signup/free-agents-signup.component';

@Component({
  selector: 'app-tournament-signup',
  templateUrl: './tournament-signup.component.html',
  styleUrl: './tournament-signup.component.css',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    ProgressSpinnerModule,
    TagModule,
    TournamentInfoComponent,
    TournamentTeamsComponent,
    TournamentDivisionsComponent,
    TournamentTeamCreateComponent,
    FreeAgentsSignupComponent,
  ],
})
export class TournamentSignupComponent implements OnInit, OnDestroy {
  isLoading = true;

  currentDate = new Date();

  golfers!: Golfer[];
  private golfersSub: Subscription;
  private golfersService = inject(GolfersService);

  tournaments!: TournamentInfo[];

  selectedTournament: TournamentInfo | undefined;
  selectedTournamentTeams: TournamentTeam[] | undefined;
  selectedTournamentFreeAgents: TournamentFreeAgentGolfer[] | undefined;
  selectedTournamentDivisions: TournamentDivision[] | undefined;

  private infoSub: Subscription;
  private teamsSub: Subscription;
  private freeAgentsSub: Subscription;
  private divisionsSub: Subscription;
  private tournamentsService = inject(TournamentsService);

  season!: Season;

  private activeSeasonSub: Subscription;
  private seasonsService = inject(SeasonsService);

  isAuthenticated = false;
  currentUser: User | null = null;
  private userSub: Subscription;
  private authService = inject(AuthService);

  selectedTeam: TournamentTeam | null = null;

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

    this.infoSub = this.tournamentsService.getListUpdateListener().subscribe((result) => {
      this.tournaments = [...result];
      this.isLoading = false;
    });

    this.teamsSub = this.tournamentsService.getTeamsUpdateListener().subscribe((result) => {
      this.selectedTournamentTeams = [...result];
    });

    this.freeAgentsSub = this.tournamentsService
      .getFreeAgentsUpdateListener()
      .subscribe((result) => {
        this.selectedTournamentFreeAgents = [...result];
      });

    this.divisionsSub = this.tournamentsService.getDivisionsUpdateListener().subscribe((result) => {
      this.selectedTournamentDivisions = [...result];
    });

    this.activeSeasonSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.season = result;
      this.tournamentsService.getList(result.year);
    });

    this.seasonsService.getActiveSeason();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.golfersSub.unsubscribe();
    this.infoSub.unsubscribe();
    this.teamsSub.unsubscribe();
    this.freeAgentsSub.unsubscribe();
    this.divisionsSub.unsubscribe();
    this.activeSeasonSub.unsubscribe();
  }

  getEarliestSignupDate(): Date {
    let d = this.tournaments[0].signup_start_date;
    for (const f of this.tournaments) {
      if (f.signup_start_date < d) {
        d = f.signup_start_date;
      }
    }
    return d;
  }

  isSignupOpen(info: TournamentInfo): boolean {
    return this.currentDate >= info.signup_start_date && this.currentDate <= info.signup_stop_date;
  }

  getDaysUntilSignupStart(info: TournamentInfo): number {
    const timeDiff = info.signup_start_date.getTime() - this.currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  getDaysUntilSignupStop(info: TournamentInfo): number {
    const timeDiff = info.signup_stop_date.getTime() - this.currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  selectTournament(info: TournamentInfo): void {
    if (!(this.isUserAdmin() || this.canUserEditTournaments()) && !this.isSignupOpen(info)) {
      return;
    }
    this.selectedTournament = info;
    this.tournamentsService.getDivisions(info.id);
    this.refreshSelectedTournamentTeams(info.id);
  }

  handleTeamSelectionChange(team: TournamentTeam | null): void {
    this.selectedTeam = team;
  }

  refreshSelectedTournamentTeams(tournamentId: number): void {
    this.tournamentsService.getTeams(tournamentId);
    this.tournamentsService.getFreeAgents(tournamentId);
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

  canUserEditTournaments(): boolean {
    if (!this.currentUser) {
      return false;
    }
    if (!this.currentUser.edit_tournaments) {
      return false;
    }
    return this.currentUser.edit_tournaments;
  }
}
