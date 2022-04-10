import { Component, OnInit, OnDestroy } from "@angular/core";
import { Sort } from "@angular/material/sort";
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
  private currentSort: Sort | null = null;

  updatedPayment: LeagueDuesPayment | null = null;

  displayedColumns: string[] = ['id', 'golfer_name', 'year', 'type', 'status', 'amount_due', 'amount_paid', 'method', 'linked_payment_id', 'comment', 'edit', 'cancel'];

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

  editPaymentInfo(payment: LeagueDuesPayment): void {
    this.updatedPayment = {
      id: payment.id,
      golfer_id: payment.golfer_id,
      golfer_name: payment.golfer_name,
      golfer_email: payment.golfer_email,
      year: payment.year,
      type: payment.type,
      amount_due: payment.amount_due,
      amount_paid: payment.amount_paid,
      is_paid: payment.is_paid,
      method: payment.method,
      linked_payment_id: payment.linked_payment_id,
      comment: payment.comment
    };
  }

  updatePaymentInfo(): void {
    if (this.updatedPayment) {
      this.paymentsService.updateLeagueDuesPayment(this.updatedPayment).subscribe(result => {
        console.log(`Updated payment id=${result.id}`);

        // Update item in list
        let payment = this.leagueDuesPayments.find(entry => entry.id === result.id);
        if (payment) {
          const newPayment = {
            id: payment.id,
            golfer_id: payment.golfer_id,
            golfer_name: payment.golfer_name,
            golfer_email: payment.golfer_email,
            year: payment.year,
            type: payment.type,
            amount_due: result.amount_due,
            amount_paid: result.amount_paid,
            is_paid: result.is_paid,
            method: result.method,
            linked_payment_id: result.linked_payment_id,
            comment: result.comment
          };

          const paymentIdx = this.leagueDuesPayments.findIndex(entry => entry.id === result.id);
          this.leagueDuesPayments[paymentIdx] = newPayment;
        }

        // Clear updated payment object
        this.updatedPayment = null;

        // Update table using current sort selection
        this.sortData(this.currentSort);
      });
    }
  }

  cancelPaymentInfoUpdate(): void {
    this.updatedPayment = null;
  }

  sortData(sort: Sort | null) {
    this.currentSort = sort;

    const data = this.leagueDuesPayments.slice();
    if (!sort || !sort.active || sort.direction === '') {
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

  getUnpaidEmailAddresses(): string {
    let mailToList = "mailto:";
    for (const payment of this.leagueDuesPayments) {
      if (payment.amount_due > payment.amount_paid && !(payment.method === "Exempt" || payment.method === "Linked")) {
        if (payment.golfer_email !== undefined) {
          mailToList += payment.golfer_email + ";"
        }
      }
    }
    return mailToList;
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
