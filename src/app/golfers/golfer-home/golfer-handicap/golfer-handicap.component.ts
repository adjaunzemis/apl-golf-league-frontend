import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

import { GolferData } from 'src/app/shared/golfer.model';
import { RoundSummary } from 'src/app/shared/round.model';
import { InitialsPipe } from 'src/app/shared/initials.pipe';
import { ScoringRecordRound } from 'src/app/shared/handicap.model';

@Component({
  selector: 'app-golfer-handicap',
  templateUrl: './golfer-handicap.component.html',
  styleUrl: './golfer-handicap.component.css',
  imports: [CommonModule, CardModule, TableModule, ChartModule, InitialsPipe],
})
export class GolferHandicapComponent implements OnInit, OnChanges {
  @Input() golfer: GolferData;
  @Input() scoringRecord: ScoringRecordRound[];

  chartData: HandicapChartData | null = null;

  // private footer = (tooltipItems: any[]) => {
  //   let sum = 0;
  //   tooltipItems.forEach(function(tooltipItem) {
  //     sum += tooltipItem.parsed.y;
  //   });
  //   return 'Sum: ' + sum;
  // };

  chartOptions = {
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        barThickness: 'flex',
        maxBarThickness: 8, // number (pixels)
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          // footer: this.footer,
        },
      },
    },
  };

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scoringRecord']) {
      this.chartData = this.updateChartData();
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

  updateChartData(): HandicapChartData | null {
    if (!this.golfer || !this.scoringRecord) {
      return null;
    }

    const dates = [];
    const differentials = [];
    const handicaps = [];
    for (const round of this.scoringRecord) {
      const datePlayed = new Date(round.date_played);
      dates.push(datePlayed.toLocaleDateString());
      differentials.push(round.score_differential);
      handicaps.push(round.handicap_index);
    }

    return {
      labels: dates,
      datasets: [
        {
          type: 'line',
          label: 'Handicap Index',
          data: handicaps,
          order: 0,
          backgroundColor: '#FFAE42',
          borderColor: '#FFAE4290',
        },
        {
          type: 'bar',
          label: 'Score Differential',
          data: differentials,
          order: 1,
          backgroundColor: '#1D73B890',
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
  data: (number | null)[];
  order?: number;
  backgroundColor?: string;
  borderColor?: string;
  tension?: number;
}
