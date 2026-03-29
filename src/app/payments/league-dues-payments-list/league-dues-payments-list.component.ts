import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

import { PaymentsService } from '../payments.service';
import { SeasonsService } from '../../seasons/seasons.service';
import { LeagueDuesPaymentData } from '../../shared/payment.model';
import { Season } from '../../shared/season.model';
import { PrimeNGModule } from '../../primeng.module';

@Component({
  selector: 'app-league-dues-payments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNGModule],
  providers: [MessageService],
  templateUrl: './league-dues-payments-list.component.html',
  styleUrls: ['./league-dues-payments-list.component.css'],
})
export class LeagueDuesPaymentsListComponent implements OnInit, OnDestroy {
  private paymentsService = inject(PaymentsService);
  private seasonsService = inject(SeasonsService);
  private messageService = inject(MessageService);

  payments: LeagueDuesPaymentData[] = [];
  clonedPayments: Record<string, LeagueDuesPaymentData> = {};
  private paymentsSub: Subscription;

  seasons: Season[] = [];
  selectedSeason: Season | null = null;

  isLoading = false;

  statusOptions = [
    { label: 'Paid', value: 1 },
    { label: 'Unpaid', value: 0 },
  ];

  methodOptions = [
    { label: 'Paypal', value: 'Paypal' },
    { label: 'Exempt', value: 'Exempt' },
    { label: 'Linked', value: 'Linked' },
    { label: 'Cash Or Check', value: 'Cash Or Check' },
  ];

  ngOnInit(): void {
    this.isLoading = true;
    this.seasonsService.getSeasons().subscribe((seasons) => {
      this.seasons = seasons.sort((a, b) => b.year - a.year);
      this.seasonsService.getActiveSeason().subscribe((activeSeason) => {
        this.selectedSeason = activeSeason;
        this.fetchPayments();
      });
    });

    this.paymentsSub = this.paymentsService
      .getLeagueDuesPaymentDataListUpdateListener()
      .subscribe((payments) => {
        this.payments = payments;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.paymentsSub) {
      this.paymentsSub.unsubscribe();
    }
  }

  onSeasonChange(): void {
    if (this.selectedSeason) {
      this.fetchPayments();
    }
  }

  fetchPayments(): void {
    if (this.selectedSeason) {
      this.isLoading = true;
      this.paymentsService.getLeagueDuesPaymentDataList(this.selectedSeason.year);
    }
  }

  onRowEditInit(payment: LeagueDuesPaymentData): void {
    this.clonedPayments[payment.id] = { ...payment };
  }

  onRowEditSave(payment: LeagueDuesPaymentData): void {
    this.paymentsService.updateLeagueDuesPayment(payment).subscribe({
      next: () => {
        delete this.clonedPayments[payment.id];
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Payment updated successfully',
        });
      },
      error: () => {
        this.onRowEditCancel(payment, this.payments.findIndex((p) => p.id === payment.id));
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update payment',
        });
      },
    });
  }

  onRowEditCancel(payment: LeagueDuesPaymentData, index: number): void {
    this.payments[index] = this.clonedPayments[payment.id];
    delete this.clonedPayments[payment.id];
  }
}
