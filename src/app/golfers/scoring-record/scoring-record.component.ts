import { Component, Input, OnInit } from '@angular/core';

import { RoundSummary } from '../../shared/round.model';

@Component({
    selector: 'app-scoring-record',
    templateUrl: './scoring-record.component.html',
    styleUrls: ['./scoring-record.component.css'],
    standalone: false
})
export class ScoringRecordComponent implements OnInit {
  @Input() activeRounds: RoundSummary[] | undefined;
  @Input() pendingRounds: RoundSummary[] | undefined;

  ngOnInit(): void {
  }

}
