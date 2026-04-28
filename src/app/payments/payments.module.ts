import { NgModule } from '@angular/core';
import { LeagueDuesPaymentComponent } from './league-dues-payment/league-dues-payment.component';
import { TournamentEntryFeePaymentComponent } from './tournament-entry-fee-payment/tournament-entry-fee-payment.component';

@NgModule({
  imports: [LeagueDuesPaymentComponent, TournamentEntryFeePaymentComponent],
  exports: [LeagueDuesPaymentComponent, TournamentEntryFeePaymentComponent],
})
export class PaymentsModule {}
