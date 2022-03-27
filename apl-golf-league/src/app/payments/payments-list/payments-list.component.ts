import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { PaymentsService } from "../payments.service";
import { LeagueDuesPayment } from './../../shared/payment.model';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.css']
})
export class PaymentsListComponent implements OnInit, OnDestroy {
  isLoading = true;

  selectedYear = 2022;

  leagueDuesSub: Subscription;

  leagueDuesPayments: LeagueDuesPayment[];

  constructor(private paymentsService: PaymentsService) { }

  ngOnInit(): void {
    this.leagueDuesSub = this.paymentsService.getLeagueDuesPaymentsListUpdateListener().subscribe(result => {
      this.leagueDuesPayments = result;
      this.isLoading = false;
    });

    this.paymentsService.getLeagueDuesPaymentsList(this.selectedYear);
  }

  ngOnDestroy(): void {
    this.leagueDuesSub.unsubscribe();
  }

}
