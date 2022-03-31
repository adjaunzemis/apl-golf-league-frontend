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

  selectedPaymentId: number = -1;

  displayedColumns: string[] = ['id', 'golfer_name', 'year', 'type', 'amount_due', 'amount_paid', 'method', 'linked_payment_id', 'comment', 'edit'];
  editableColumns: string[] = ['amount_due', 'amount_paid', 'method', 'linked_payment_id', 'comment'];
  columnNames: { [key: string]: string } = {
    "id": "Payment Id",
    "golfer_name": "Golfer",
    "year": "Year",
    "type": "Type",
    "amount_due": "Due",
    "amount_paid": "Paid",
    "method": "Method",
    "linked_payment_id": "Linked Payment Id",
    "comment": "Comment",
    "edit": "Edit"
  };

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

  isEditable(columnName: string): boolean {
    return this.editableColumns.includes(columnName);
  }

  updatePaymentInfo(payment: LeagueDuesPayment): void {
    this.paymentsService.updateLeagueDuesPayment(payment).subscribe(result => {
      console.log(`Updated payment id=${result.id}`);
      this.selectedPaymentId = -1;
    });
  }

}
