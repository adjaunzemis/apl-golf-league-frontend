import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "src/app/angular-material.module";
import { PaymentsListComponent } from "./payments-list/payments-list.component";
import { FlightDuesPaymentComponent } from "./flight-dues-payment/flight-dues-payment.component";

@NgModule({
  declarations: [
    PaymentsListComponent,
    FlightDuesPaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    FormsModule
  ],
  exports: [
    FlightDuesPaymentComponent
  ]
})
export class PaymentsModule {}
