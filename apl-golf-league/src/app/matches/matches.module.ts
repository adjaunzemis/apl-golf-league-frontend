import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { ScorecardModule } from "../shared/scorecard/scorecard.module";
import { MatchScorecardScoreLineComponent } from "./match-scorecard/match-scorecard-score-line/match-scorecard-score-line.component";
import { MatchScorecardComponent } from "./match-scorecard/match-scorecard.component";

@NgModule({
  declarations: [
    MatchScorecardComponent,
    MatchScorecardScoreLineComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ScorecardModule
  ],
  exports: [
    MatchScorecardComponent
  ]
})
export class MatchesModule {}
