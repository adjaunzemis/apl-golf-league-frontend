import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PaymentsService } from '../payments.service';
import { SeasonsService } from '../../seasons/seasons.service';
import { LeagueDuesPaymentData } from '../../shared/payment.model';
import { Season } from '../../shared/season.model';
import { PrimeNGModule } from '../../primeng.module';

@Component({
  selector: 'app-league-dues-payments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNGModule],
  templateUrl: './league-dues-payments-list.component.html',
  styleUrls: ['./league-dues-payments-list.component.css'],
})
export class LeagueDuesPaymentsListComponent implements OnInit, OnDestroy {
  private paymentsService = inject(PaymentsService);
  private seasonsService = inject(SeasonsService);

  payments: LeagueDuesPaymentData[] = [];
  private paymentsSub: Subscription;

  seasons: Season[] = [];
  selectedSeason: Season | null = null;

  isLoading = false;

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
}
