import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

import { GolferData } from 'src/app/shared/golfer.model';
import { RoundSummary } from 'src/app/shared/round.model';
import { InitialsPipe } from 'src/app/shared/initials.pipe';

@Component({
  selector: 'app-golfer-handicap',
  templateUrl: './golfer-handicap.component.html',
  styleUrl: './golfer-handicap.component.css',
  imports: [CommonModule, CardModule, TableModule, ChartModule, InitialsPipe],
})
export class GolferHandicapComponent implements OnInit {
  @Input() golfer: GolferData;

  rounds!: RoundSummary[];
  pending_rounds!: RoundSummary[];

  ngOnInit(): void {
    this.rounds = [];
    if (this.golfer.handicap_index_data) {
      this.rounds.push(...this.golfer.handicap_index_data.active_rounds);
    }

    this.pending_rounds = [];
    if (this.golfer.handicap_index_data) {
      this.pending_rounds.push(...this.golfer.handicap_index_data.pending_rounds);
    }
  }

  getActiveIndex(): number | null {
    if (
      this.golfer &&
      this.golfer.handicap_index_data &&
      this.golfer.handicap_index_data.active_handicap_index
    ) {
      return this.golfer.handicap_index_data.active_handicap_index;
    }
    return null;
  }

  getActiveIndexDate(): Date | null {
    if (
      this.golfer &&
      this.golfer.handicap_index_data &&
      this.golfer.handicap_index_data.active_date
    ) {
      return this.golfer.handicap_index_data.active_date;
    }
    return null;
  }

  getPendingIndex(): number | null {
    if (
      this.golfer &&
      this.golfer.handicap_index_data &&
      this.golfer.handicap_index_data.pending_handicap_index
    ) {
      return this.golfer.handicap_index_data.pending_handicap_index;
    }
    return null;
  }

  getChartData(): HandicapChartData | null {
    if (!this.golfer || !this.golfer.handicap_index_data) {
      return null;
    }

    const dates_counting = [];
    const differentials_counting = [];
    for (const round of this.golfer.handicap_index_data.active_rounds) {
      const datePlayed = new Date(round.date_played);
      dates_counting.push(datePlayed.toLocaleDateString());
      differentials_counting.push(round.score_differential);
    }

    const dates_other = [];
    const differentials_other = [];
    for (const round of this.golfer.handicap_index_data.active_rounds) {
      const datePlayed = new Date(round.date_played);
      dates_other.push(datePlayed.toLocaleDateString());
      differentials_other.push(round.score_differential);
    }

    return {
      labels: dates_counting,
      datasets: [
        {
          type: 'bar',
          label: 'Counting',
          data: differentials_counting,
          backgroundColor: '#1d73b890',
        },
        {
          type: 'bar',
          label: 'Others',
          data: differentials_counting,
          backgroundColor: '#c2ddf290',
        },
      ],
    };
  }
}

interface HandicapChartData {
  labels: string[];
  datasets: HandicapChartDataset[];
}

interface HandicapChartDataset {
  type: string;
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  tension?: number;
}
