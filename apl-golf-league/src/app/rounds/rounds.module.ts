import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { RoundListComponent } from "./round-list/round-list.component";
import { RoundScorecardComponent } from "./round-scorecard/round-scorecard.component";


@NgModule({
  declarations: [
    RoundListComponent,
    RoundScorecardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class RoundsModule {}
