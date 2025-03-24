import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';

import { TournamentStatistics } from 'src/app/shared/tournament.model';

@Component({
  selector: 'app-tournament-statistics',
  templateUrl: './tournament-statistics.component.html',
  styleUrls: ['./tournament-statistics.component.css'],
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
export class TournamentStatisticsComponent implements OnInit {
  @Input() statistics: TournamentStatistics;

  displayStatistics: GolferStatistics[] = [];

  scoringMode = 'gross';
  labelScoringModeGross = 'Scoring Mode: Gross';
  labelScoringModeNet = 'Scoring Mode: Net';

  ngOnInit(): void {
    this.updateGolferStatistics();
  }

  updateGolferStatistics(): void {
    this.displayStatistics = [];

    for (const golfer of this.statistics.golfers) {
      const golferScoring = this.scoringMode == 'gross' ? golfer.gross_scoring : golfer.net_scoring;

      this.displayStatistics.push({
        golfer_id: golfer.golfer_id,
        golfer_name: golfer.golfer_name,
        golfer_team_id: golfer.golfer_team_id,
        golfer_team_role: golfer.golfer_team_role,
        num_rounds: golfer.num_rounds,
        num_holes: golfer.num_holes,
        num_par_3_holes: golfer.num_par_3_holes,
        num_par_4_holes: golfer.num_par_4_holes,
        num_par_5_holes: golfer.num_par_5_holes,
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
}

interface GolferStatistics {
  golfer_id: number;
  golfer_name: string;
  golfer_team_id: number;
  golfer_team_role: string;
  num_rounds: number;
  num_holes: number;
  num_par_3_holes: number;
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
