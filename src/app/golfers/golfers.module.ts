import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ScoringRecordComponent } from './scoring-record/scoring-record.component';
import { CombinedRoundsScorecardComponent } from './combined-rounds-scorecard/combined-rounds-scorecard.component';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { AverageScoreLineComponent } from './combined-rounds-scorecard/average-score-line/average-score-line.component';

@NgModule({
  declarations: [
    ScoringRecordComponent,
    CombinedRoundsScorecardComponent,
    AverageScoreLineComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, ScorecardModule],
})
export class GolfersModule {}
