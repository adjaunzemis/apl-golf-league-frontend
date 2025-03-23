import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { TournamentsService } from '../tournaments.service';
import { TournamentInfo } from 'src/app/shared/tournament.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { Season } from 'src/app/shared/season.model';

@Component({
  selector: 'app-tournament-signup',
  templateUrl: './tournament-signup.component.html',
  styleUrl: './tournament-signup.component.css',
  imports: [CommonModule, CardModule, DataViewModule, ProgressSpinnerModule],
})
export class TournamentSignupComponent implements OnInit, OnDestroy {
  isLoading = true;

  tournaments!: TournamentInfo[];

  private infoSub: Subscription;
  private tournamentsService = inject(TournamentsService);

  season!: Season;

  private activeSeasonSub: Subscription;
  private seasonsService = inject(SeasonsService);

  ngOnInit(): void {
    this.infoSub = this.tournamentsService
      .getTournamentsListUpdateListener()
      .subscribe((result) => {
        this.tournaments = [...result.tournaments];
        this.isLoading = false;
      });

    this.activeSeasonSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.season = result;
      this.tournamentsService.getTournamentsList(result.year);
    });

    this.seasonsService.getActiveSeason();
  }

  ngOnDestroy(): void {
    this.infoSub.unsubscribe();
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
}
