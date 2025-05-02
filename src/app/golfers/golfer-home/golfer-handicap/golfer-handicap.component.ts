import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { GolferData } from 'src/app/shared/golfer.model';

@Component({
  selector: 'app-golfer-handicap',
  templateUrl: './golfer-handicap.component.html',
  styleUrl: './golfer-handicap.component.css',
  imports: [CommonModule, CardModule],
})
export class GolferHandicapComponent {
  @Input() golfer: GolferData;

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
}
