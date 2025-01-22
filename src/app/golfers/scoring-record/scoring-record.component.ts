import { Component, Input } from '@angular/core';

import { RoundSummary } from '../../shared/round.model';

@Component({
  selector: 'app-scoring-record',
  templateUrl: './scoring-record.component.html',
  styleUrls: ['./scoring-record.component.css'],
  standalone: false,
})
export class ScoringRecordComponent {
  @Input() activeRounds: RoundSummary[] | undefined;
  @Input() pendingRounds: RoundSummary[] | undefined;
}
