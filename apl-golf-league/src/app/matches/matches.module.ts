import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { ScorecardScoreLineComponent } from "../shared/scorecard-score-line/scorecard-score-line.component";
import { ScorecardTeeInfoComponent } from "../shared/scorecard-tee-info/scorecard-tee-info.component";
import { MatchListComponent } from "./match-list/match-list.component";
import { MatchScorecardComponent } from "./match-scorecard/match-scorecard.component";

@NgModule({
  declarations: [
    MatchListComponent,
    MatchScorecardComponent,
    ScorecardTeeInfoComponent,
    ScorecardScoreLineComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class MatchesModule {}
