import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { FlightsDashboardComponent } from '../flights/flights-dashboard/flights-dashboard.component';
import { TournamentsDashboardComponent } from '../tournaments/tournaments-dashboard/tournaments-dashboard.component';
import { OfficersDashboardComponent } from '../officers/officers-dashboard/officers-dashboard.component';
import { RulesDashboardComponent } from '../rules-dashboard/rules-dashboard.component';
import { AnnouncementsDashboardComponent } from '../announcements-dashboard/announcements-dashboard.component';
import { SeasonsService } from '../seasons/seasons.service';
import { Season } from '../shared/season.model';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css'],
  imports: [
    FormsModule,
    CardModule,
    SelectModule,
    TagModule,
    FlightsDashboardComponent,
    TournamentsDashboardComponent,
    OfficersDashboardComponent,
    RulesDashboardComponent,
    AnnouncementsDashboardComponent,
  ],
})
export class LeagueHomeComponent implements OnInit, OnDestroy {
  seasons: Season[];
  private seasonsSub: Subscription;
  private activeSeasonSub: Subscription;
  private specificSeasonSub: Subscription;

  selectedSeason: Season;
  private seasonsService = inject(SeasonsService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.seasonsSub = this.seasonsService.getSeasons().subscribe((result) => {
      this.seasons = [...result];
    });

    this.route.queryParams.subscribe((params) => {
      if (!params['year']) {
        this.activeSeasonSub = this.seasonsService.getActiveSeason().subscribe((result) => {
          if (!this.selectedSeason) {
            this.selectedSeason = result;
            this.updateUrl();
          }
        });
        this.seasonsService.getActiveSeason();
      } else {
        this.specificSeasonSub = this.seasonsService
          .getSeason(params['year'])
          .subscribe((result) => {
            this.selectedSeason = result;
            this.updateUrl();
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.seasonsSub.unsubscribe();
    if (this.activeSeasonSub) {
      this.activeSeasonSub.unsubscribe();
    }
    if (this.specificSeasonSub) {
      this.specificSeasonSub.unsubscribe();
    }
  }

  updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { year: this.selectedSeason.year },
      queryParamsHandling: 'merge',
    });
  }
}
