import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { ScorecardModule } from "../shared/scorecard/scorecard.module";
import { MatchListComponent } from "./match-list/match-list.component";
import { MatchScorecardScoreLineComponent } from "./match-scorecard/match-scorecard-score-line/match-scorecard-score-line.component";
import { MatchScorecardComponent } from "./match-scorecard/match-scorecard.component";

@NgModule({
  declarations: [
    MatchListComponent,
    MatchScorecardComponent,
    MatchScorecardScoreLineComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ScorecardModule
  ]
})
export class MatchesModule {}
