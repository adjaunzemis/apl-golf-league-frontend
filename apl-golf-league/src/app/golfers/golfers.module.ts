import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { AngularMaterialModule } from "../angular-material.module";
import { GolferHomeComponent } from './golfer-home/golfer-home.component';
import { ScoringRecordComponent } from './scoring-record/scoring-record.component';
import { CombinedRoundsScorecardComponent } from './combined-rounds-scorecard/combined-rounds-scorecard.component';
import { ScorecardModule } from "../shared/scorecard/scorecard.module";
import { AverageScoreLineComponent } from './combined-rounds-scorecard/average-score-line/average-score-line.component';
import { GolferCreateComponent } from "./golfer-create/golfer-create.component";


@NgModule({
  declarations: [
    GolferHomeComponent,
    ScoringRecordComponent,
    CombinedRoundsScorecardComponent,
    AverageScoreLineComponent,
    GolferCreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AngularMaterialModule,
    ScorecardModule
  ]
})
export class GolfersModule {}
