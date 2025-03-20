import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';

import { FlightStatistics } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-statistics',
  templateUrl: './flight-statistics.component.html',
  styleUrls: ['./flight-statistics.component.css'],
  imports: [CommonModule, FormsModule, CardModule, TabsModule, TableModule, ToggleButtonModule],
})
export class FlightStatisticsComponent implements OnInit {
  @Input() statistics: FlightStatistics;

  displayStatistics: GolferStatistics[] = [];

  scoringMode = 'gross';

  scoring_mode_label_gross = 'Scoring Mode: Gross';
  scoring_mode_label_net = 'Scoring Mode: Net';

  ngOnInit(): void {
    this.updateGolferStatistics();
  }

  updateGolferStatistics(): void {
    this.displayStatistics = [];

    for (const golfer of this.statistics.golfers) {
      this.displayStatistics.push({
        golfer_id: golfer.golfer_id,
        golfer_name: golfer.golfer_name,
        golfer_team_id: golfer.golfer_team_id,
        golfer_team_role: golfer.golfer_team_role,
        num_matches: golfer.num_matches,
        num_rounds: golfer.num_rounds,
        points_won: golfer.points_won,
        avg_points_won: golfer.avg_points_won,
        avg_score: this.scoringMode == 'gross' ? golfer.avg_gross : golfer.avg_net,
        avg_score_to_par:
          this.scoringMode == 'gross' ? golfer.avg_gross_to_par : golfer.avg_net_to_par,
        num_holes: golfer.num_holes,
        num_par_3_holes: golfer.num_par_3_holes,
        avg_par_3_score:
          this.scoringMode == 'gross' ? golfer.avg_par_3_gross : golfer.avg_par_3_net,
        num_par_4_holes: golfer.num_par_4_holes,
        avg_par_4_score:
          this.scoringMode == 'gross' ? golfer.avg_par_4_gross : golfer.avg_par_4_net,
        num_par_5_holes: golfer.num_par_5_holes,
        avg_par_5_score:
          this.scoringMode == 'gross' ? golfer.avg_par_5_gross : golfer.avg_par_5_net,
        num_aces: this.scoringMode == 'gross' ? golfer.num_aces : golfer.num_aces, // TODO: net
        num_albatrosses:
          this.scoringMode == 'gross' ? golfer.num_albatrosses : golfer.num_albatrosses, // TODO: net
        num_eagles: this.scoringMode == 'gross' ? golfer.num_eagles : golfer.num_eagles, // TODO: net
        num_birdies: this.scoringMode == 'gross' ? golfer.num_birdies : golfer.num_birdies, // TODO: net
        num_pars: this.scoringMode == 'gross' ? golfer.num_pars : golfer.num_pars, // TODO: net
        num_bogeys: this.scoringMode == 'gross' ? golfer.num_bogeys : golfer.num_bogeys, // TODO: net
        num_double_bogeys:
          this.scoringMode == 'gross' ? golfer.num_double_bogeys : golfer.num_double_bogeys, // TODO: net
        num_others: this.scoringMode == 'gross' ? golfer.num_others : golfer.num_others, // TODO: net
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
  num_matches: number;
  num_rounds: number;
  points_won: number;
  avg_points_won: number;
  avg_score: number;
  avg_score_to_par: number;
  num_holes: number;
  num_par_3_holes: number;
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
