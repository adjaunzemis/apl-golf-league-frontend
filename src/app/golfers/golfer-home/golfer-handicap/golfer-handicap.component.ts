import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { GolferData } from 'src/app/shared/golfer.model';
import { TableModule } from 'primeng/table';
import { RoundSummary } from 'src/app/shared/round.model';
import { InitialsPipe } from 'src/app/shared/initials.pipe';

@Component({
  selector: 'app-golfer-handicap',
  templateUrl: './golfer-handicap.component.html',
  styleUrl: './golfer-handicap.component.css',
  imports: [CommonModule, CardModule, TableModule, InitialsPipe],
})
export class GolferHandicapComponent implements OnInit {
  @Input() golfer: GolferData;

  rounds!: RoundSummary[];

  ngOnInit(): void {
    this.rounds = [];
    if (this.golfer.handicap_index_data && this.golfer.handicap_index_data.active_rounds) {
      this.rounds.push(...this.golfer.handicap_index_data.active_rounds);
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
}
