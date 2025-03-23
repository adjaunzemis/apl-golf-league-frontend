import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
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
    CommonModule,
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

  selectedSeason: Season;
  private seasonsService = inject(SeasonsService);

  ngOnInit(): void {
    this.seasonsSub = this.seasonsService.getSeasons().subscribe((result) => {
      this.seasons = [...result];
    });

    this.activeSeasonSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      if (!this.selectedSeason) {
        this.selectedSeason = result;
      }
    });
  }

  ngOnDestroy(): void {
    this.seasonsSub.unsubscribe();
    this.activeSeasonSub.unsubscribe();
  }

  onSelectedYearChanged(event: SelectChangeEvent): void {
    this.seasonsService.setFocusedSeason(event.value);
  }
}
