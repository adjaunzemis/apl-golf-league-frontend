import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';
import { GolferHomeOldComponent } from './golfer-home-old/golfer-home-old.component';
import { ScoringRecordComponent } from './scoring-record/scoring-record.component';
import { CombinedRoundsScorecardComponent } from './combined-rounds-scorecard/combined-rounds-scorecard.component';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { AverageScoreLineComponent } from './combined-rounds-scorecard/average-score-line/average-score-line.component';
import { AddQualifyingScoreComponent } from './add-qualifying-score/add-qualifying-score.component';

@NgModule({
  declarations: [
    GolferHomeOldComponent,
    ScoringRecordComponent,
    CombinedRoundsScorecardComponent,
    AverageScoreLineComponent,
    AddQualifyingScoreComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, AngularMaterialModule, ScorecardModule],
})
export class GolfersModule {}
