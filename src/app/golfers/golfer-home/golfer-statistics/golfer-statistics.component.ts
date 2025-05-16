import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

import { GolferStatistics } from 'src/app/shared/golfer.model';

@Component({
  selector: 'app-golfer-statistics',
  templateUrl: './golfer-statistics.component.html',
  styleUrl: './golfer-statistics.component.css',
  imports: [CommonModule, CardModule, ChartModule],
})
export class GolferStatisticsComponent implements OnInit, OnChanges {
  @Input() statistics!: GolferStatistics;

  chartData: StatisticsChartData | null = null;
  chartOptions = {
    scales: {
      r: {
        suggestedMin: -0.5,
        suggestedMax: 0.5,
        reverse: false,
      },
    },
  };

  ngOnInit(): void {
    this.chartData = this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statistics']) {
      this.chartData = this.updateChartData();
    }
  }

  updateChartData(): StatisticsChartData | null {
    if (!this.statistics || this.statistics.num_rounds == 0) {
      return null;
    }

    return {
      labels: ['Par 4', 'Par 5', 'Par 3'],
      datasets: [
        {
          label: 'Gross',
          borderColor: '#1D73B8',
          pointBackgroundColor: '#1D73B8',
          pointBorderColor: '#1D73B8',
          pointHoverBackgroundColor: 'black',
          pointHoverBorderColor: '#1D73B8',
          data: [
            this.statistics.gross_scoring.avg_par_4_score - 4,
            this.statistics.gross_scoring.avg_par_5_score - 5,
            this.statistics.gross_scoring.avg_par_3_score - 3,
          ],
        },
        {
          label: 'Net',
          borderColor: '#FFAE42',
          pointBackgroundColor: '#FFAE42',
          pointBorderColor: '#FFAE42',
          pointHoverBackgroundColor: 'black',
          pointHoverBorderColor: '#FFAE42',
          data: [
            this.statistics.net_scoring.avg_par_4_score - 4,
            this.statistics.net_scoring.avg_par_5_score - 5,
            this.statistics.net_scoring.avg_par_3_score - 3,
          ],
        },
      ],
    };
  }
}

interface StatisticsChartData {
  labels: string[];
  datasets: StatisticsChartDataset[];
}

interface StatisticsChartDataset {
  label: string;
  data: (number | null)[];
  borderColor?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
}
