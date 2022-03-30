import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "src/app/angular-material.module";
import { PaymentsListComponent } from "./payments-list/payments-list.component";
import { PaypalComponent } from "./paypal/paypal.component";

@NgModule({
  declarations: [
    PaymentsListComponent,
    PaypalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    FormsModule
  ],
  exports: [
    PaypalComponent
  ]
})
export class PaymentsModule {}
