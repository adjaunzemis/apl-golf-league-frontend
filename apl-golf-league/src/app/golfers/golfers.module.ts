import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { GolferListComponent } from "./golfer-list/golfer-list.component";
import { GolferHomeComponent } from './golfer-home/golfer-home.component';
import { ScoringRecordComponent } from './scoring-record/scoring-record.component';


@NgModule({
  declarations: [
    GolferListComponent,
    GolferHomeComponent,
    ScoringRecordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class GolfersModule {}
