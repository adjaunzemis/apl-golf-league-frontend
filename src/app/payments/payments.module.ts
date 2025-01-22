import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "src/app/angular-material.module";
import { LeagueDuesPaymentsListComponent } from "./league-dues-payments-list/league-dues-payments-list.component";
import { LeagueDuesPaymentComponent } from "./league-dues-payment/league-dues-payment.component";
import { TournamentEntryFeePaymentsListComponent } from "./tournament-entry-fee-payments-list/tournament-entry-fee-payments-list.component";
import { TournamentEntryFeesPaymentComponent } from "./tournament-entry-fees-payment/tournament-entry-fees-payment.component";

@NgModule({
  declarations: [
    LeagueDuesPaymentsListComponent,
    LeagueDuesPaymentComponent,
    TournamentEntryFeePaymentsListComponent,
    TournamentEntryFeesPaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    FormsModule
  ],
  exports: [
    LeagueDuesPaymentComponent,
    TournamentEntryFeesPaymentComponent
  ]
})
export class PaymentsModule {}
