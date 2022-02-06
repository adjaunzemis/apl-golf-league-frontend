import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { GolferHomeComponent } from './golfer-home/golfer-home.component';
import { ScoringRecordComponent } from './scoring-record/scoring-record.component';
import { CombinedRoundsScorecardComponent } from './combined-rounds-scorecard/combined-rounds-scorecard.component';
import { ScorecardModule } from "../shared/scorecard/scorecard.module";


@NgModule({
  declarations: [
    GolferHomeComponent,
    ScoringRecordComponent,
    CombinedRoundsScorecardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ScorecardModule
  ]
})
export class GolfersModule {}
