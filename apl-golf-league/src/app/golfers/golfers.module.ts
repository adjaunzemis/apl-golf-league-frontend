import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { GolferListComponent } from "./golfer-list/golfer-list.component";
import { GolferHomeComponent } from './golfer-home/golfer-home.component';


@NgModule({
  declarations: [
    GolferListComponent,
    GolferHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class GolfersModule {}
