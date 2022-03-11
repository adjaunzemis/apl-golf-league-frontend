import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DivisionListComponent } from "./division-list/division-list.component";

@NgModule({
  declarations: [
    DivisionListComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DivisionListComponent
  ]
})
export class DivisionsModule {}
