import { Component, Input, OnInit } from '@angular/core';

import { TeamGolferData } from '../../shared/golfer.model';

@Component({
  selector: 'app-golfer-statistics',
  templateUrl: './golfer-statistics.component.html',
  styleUrls: ['./golfer-statistics.component.css'],
  standalone: false,
})
export class GolferStatisticsComponent implements OnInit {
  @Input() golfers: TeamGolferData[];
  @Input() hideEmptyColumns = false;
  columnsToDisplay = [
    'golfer_name',
    'num_rounds',
    'avg_gross_score',
    'avg_net_score',
    'num_holes',
    'num_aces',
    'num_albatrosses',
    'num_eagles',
    'num_birdies',
    'num_pars',
    'num_bogeys',
    'num_double_bogeys',
    'num_others',
  ];

  ngOnInit(): void {
    if (this.hideEmptyColumns) {
      this.filterColumnsToDisplay();
    }
  }

  private filterColumnsToDisplay() {
    let num_aces = 0;
    let num_albatrosses = 0;
    let num_eagles = 0;
    let num_birdies = 0;
    let num_pars = 0;
    let num_bogeys = 0;
    let num_double_bogeys = 0;
    let num_others = 0;

    for (const golfer of this.golfers) {
      if (golfer.statistics) {
        num_aces += golfer.statistics.num_aces;
        num_albatrosses += golfer.statistics.num_albatrosses;
        num_eagles += golfer.statistics.num_eagles;
        num_birdies += golfer.statistics.num_birdies;
        num_pars += golfer.statistics.num_pars;
        num_bogeys += golfer.statistics.num_bogeys;
        num_double_bogeys += golfer.statistics.num_double_bogeys;
        num_others += golfer.statistics.num_others;
      }
    }

    if (num_aces == 0) {
      const idx = this.columnsToDisplay.indexOf('num_aces');
      this.columnsToDisplay.splice(idx, 1);
    }
    if (num_albatrosses == 0) {
      const idx = this.columnsToDisplay.indexOf('num_albatrosses');
      this.columnsToDisplay.splice(idx, 1);
    }
    if (num_eagles == 0) {
      const idx = this.columnsToDisplay.indexOf('num_eagles');
      this.columnsToDisplay.splice(idx, 1);
    }
    if (num_birdies == 0) {
      const idx = this.columnsToDisplay.indexOf('num_birdies');
      this.columnsToDisplay.splice(idx, 1);
    }
    if (num_pars == 0) {
      const idx = this.columnsToDisplay.indexOf('num_pars');
      this.columnsToDisplay.splice(idx, 1);
    }
    if (num_bogeys == 0) {
      const idx = this.columnsToDisplay.indexOf('num_bogeys');
      this.columnsToDisplay.splice(idx, 1);
    }
    if (num_double_bogeys == 0) {
      const idx = this.columnsToDisplay.indexOf('num_double_bogeys');
      this.columnsToDisplay.splice(idx, 1);
    }
    if (num_others == 0) {
      const idx = this.columnsToDisplay.indexOf('num_others');
      this.columnsToDisplay.splice(idx, 1);
    }
  }
}
