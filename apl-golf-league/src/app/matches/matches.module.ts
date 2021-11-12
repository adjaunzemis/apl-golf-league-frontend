import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { MatchListComponent } from "./match-list/match-list.component";
import { MatchScorecardComponent } from "./match-scorecard/match-scorecard.component";

@NgModule({
  declarations: [
    MatchListComponent,
    MatchScorecardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class MatchesModule {}
