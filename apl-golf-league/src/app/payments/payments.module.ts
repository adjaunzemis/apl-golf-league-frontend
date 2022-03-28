import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "src/app/angular-material.module";
import { PaymentsListComponent } from "./payments-list/payments-list.component";

@NgModule({
  declarations: [
    PaymentsListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    FormsModule
  ]
})
export class PaymentsModule {}
