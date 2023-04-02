import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "src/app/angular-material.module";
import { PaymentsListComponent } from "./payments-list/payments-list.component";
import { LeagueDuesPaymentComponent } from "./league-dues-payment/league-dues-payment.component";

@NgModule({
  declarations: [
    PaymentsListComponent,
    LeagueDuesPaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    FormsModule
  ],
  exports: [
    LeagueDuesPaymentComponent
  ]
})
export class PaymentsModule {}
