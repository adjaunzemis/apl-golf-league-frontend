import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatSort, Sort } from "@angular/material/sort";
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
  sortedData: LeagueDuesPayment[];

  selectedPaymentId: number = -1;

  displayedColumns: string[] = ['id', 'golfer_name', 'year', 'type', 'amount_due', 'amount_paid', 'method', 'linked_payment_id', 'comment', 'edit'];
  editableColumns: string[] = ['amount_due', 'amount_paid', 'method', 'linked_payment_id', 'comment'];

  constructor(private paymentsService: PaymentsService) { }

  ngOnInit(): void {
    this.leagueDuesSub = this.paymentsService.getLeagueDuesPaymentsListUpdateListener().subscribe(result => {
      this.leagueDuesPayments = result;
      this.sortedData = this.leagueDuesPayments;
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

  sortData(sort: Sort) {
    const data = this.leagueDuesPayments.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'golfer_name':
          return compareLastNames(a.golfer_name, b.golfer_name, isAsc);
        case 'id':
        case 'year':
        case 'type':
        case 'amount_due':
        case 'amount_paid':
        case 'method':
        case 'linked_payment_id':
        case 'comment':
          return compare(a[sort.active], b[sort.active], isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareLastNames(a: string, b: string, isAsc: boolean) {
  const aLastName = a.split(' ').pop();
  const bLastName = b.split(' ').pop();
  if (aLastName === undefined || bLastName === undefined) {
    return 0;
  }
  return (aLastName < bLastName ? -1 : 1) * (isAsc ? 1 : -1);
}
