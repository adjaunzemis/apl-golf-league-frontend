import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';

import { FlightStatistics } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-statistics',
  templateUrl: './flight-statistics.component.html',
  styleUrls: ['./flight-statistics.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TabsModule,
    TableModule,
    ToggleButtonModule,
    CheckboxModule,
  ],
})
export class FlightStatisticsComponent implements OnInit {
  @Input() statistics: FlightStatistics;
  @Input() matchCountLimit = 3;

  displayStatistics: GolferStatistics[] = [];

  scoringMode = 'gross';
  labelScoringModeGross = 'Scoring Mode: Gross';
  labelScoringModeNet = 'Scoring Mode: Net';

  showSubstitutes = false;
  labelShowSubstitutesOn = 'Substitutes: Include';
  labelShowSubstitutesOff = 'Substitutes: Exclude';

  filterLowMatchCount = true;
  labelFilterLowMatchCountEnabled = `Min Matches: ${this.matchCountLimit}`;
  labelFilterLowMatchCountDisabled = 'Min Matches: n/a';

  ngOnInit(): void {
    this.updateGolferStatistics();
  }

  updateGolferStatistics(): void {
    this.displayStatistics = [];

    for (const golfer of this.statistics.golfers) {
      if (!this.showSubstitutes && golfer.golfer_team_role === 'Substitute') {
        continue;
      }
      if (this.filterLowMatchCount && golfer.num_matches < this.matchCountLimit) {
        continue;
      }

      const golferScoring = this.scoringMode == 'gross' ? golfer.gross_scoring : golfer.net_scoring;

      this.displayStatistics.push({
        golfer_id: golfer.golfer_id,
        golfer_name: golfer.golfer_name,
        golfer_team_id: golfer.golfer_team_id,
        golfer_team_role: golfer.golfer_team_role,
        num_matches: golfer.num_matches,
        num_rounds: golfer.num_rounds,
        num_holes: golfer.num_holes,
        num_par_3_holes: golfer.num_par_3_holes,
        num_par_4_holes: golfer.num_par_4_holes,
        num_par_5_holes: golfer.num_par_5_holes,
        points_won: golfer.points_won,
        avg_points_won: golfer.avg_points_won,
        avg_score: golferScoring.avg_score,
        avg_score_to_par: golferScoring.avg_score_to_par,
        avg_par_3_score: golferScoring.avg_par_3_score,
        avg_par_4_score: golferScoring.avg_par_4_score,
        avg_par_5_score: golferScoring.avg_par_5_score,
        num_aces: golferScoring.num_aces,
        num_albatrosses: golferScoring.num_albatrosses,
        num_eagles: golferScoring.num_eagles,
        num_birdies: golferScoring.num_birdies,
        num_pars: golferScoring.num_pars,
        num_bogeys: golferScoring.num_bogeys,
        num_double_bogeys: golferScoring.num_double_bogeys,
        num_others: golferScoring.num_others,
      });
    }
  }

  onChangeScoringMode(event: ToggleButtonChangeEvent): void {
    if (event.checked) {
      this.scoringMode = 'net';
    } else {
      this.scoringMode = 'gross';
    }
    this.updateGolferStatistics();
  }

  onChangeShowSubstitutes(event: ToggleButtonChangeEvent): void {
    if (event.checked) {
      this.showSubstitutes = true;
    } else {
      this.showSubstitutes = false;
    }
    this.updateGolferStatistics();
  }

  onChangeFilterLowMatchCount(event: ToggleButtonChangeEvent): void {
    if (event.checked) {
      this.filterLowMatchCount = false;
    } else {
      this.filterLowMatchCount = true;
    }
    this.updateGolferStatistics();
  }
}

interface GolferStatistics {
  golfer_id: number;
  golfer_name: string;
  golfer_team_id: number;
  golfer_team_role: string;
  num_matches: number;
  num_rounds: number;
  num_holes: number;
  num_par_3_holes: number;
  points_won: number;
  avg_points_won: number;
  avg_score: number;
  avg_score_to_par: number;
  avg_par_3_score: number;
  num_par_4_holes: number;
  avg_par_4_score: number;
  num_par_5_holes: number;
  avg_par_5_score: number;
  num_aces: number;
  num_albatrosses: number;
  num_eagles: number;
  num_birdies: number;
  num_pars: number;
  num_bogeys: number;
  num_double_bogeys: number;
  num_others: number;
}
