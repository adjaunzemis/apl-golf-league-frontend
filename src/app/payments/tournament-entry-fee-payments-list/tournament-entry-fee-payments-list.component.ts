import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { PaymentsService } from '../payments.service';
import { TournamentsService } from '../../tournaments/tournaments.service';
import { TournamentData, TournamentInfo } from '../../shared/tournament.model';
import { TournamentEntryFeePaymentData } from '../../shared/payment.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-tournament-entry-fee-payments-list',
  templateUrl: './tournament-entry-fee-payments-list.component.html',
  styleUrls: ['./tournament-entry-fee-payments-list.component.css'],
  standalone: false,
})
export class TournamentEntryFeePaymentsListComponent implements OnInit, OnDestroy {
  isLoading = true;

  selectedYear = 0;
  private seasonsSub: Subscription;

  tournamentId = -1;

  private paymentsSub: Subscription;

  tournamentOptions: TournamentInfo[];
  private tournamentOptionsSub: Subscription;

  selectedTournament: TournamentData;
  private tournamentSub: Subscription;

  tournamentEntryFeePayments: TournamentEntryFeePaymentData[];
  sortedData: TournamentEntryFeePaymentData[];
  private currentSort: Sort | null = null;

  updatedPayment: TournamentEntryFeePaymentData | null = null;

  displayedColumns: string[] = [
    'id',
    'golfer_name',
    'year',
    'tournament_id',
    'type',
    'status',
    'amount_due',
    'amount_paid',
    'method',
    'linked_payment_id',
    'comment',
    'edit',
    'cancel',
  ];

  constructor(
    private paymentsService: PaymentsService,
    private tournamentsService: TournamentsService,
    private seasonsService: SeasonsService,
  ) {}

  ngOnInit(): void {
    this.tournamentOptionsSub = this.tournamentsService
      .getListUpdateListener()
      .subscribe((result) => {
        this.tournamentOptions = [...result];
      });

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.selectedYear = result.year;

      this.tournamentsService.getList(this.selectedYear);
    });

    this.tournamentSub = this.tournamentsService
      .getTournamentUpdateListener()
      .subscribe((result) => {
        this.selectedTournament = result;
      });

    this.paymentsSub = this.paymentsService
      .getTournamentEntryFeePaymentDataListUpdateListener()
      .subscribe((result) => {
        this.tournamentEntryFeePayments = result;
        this.sortedData = this.tournamentEntryFeePayments;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.tournamentSub.unsubscribe();
    this.paymentsSub.unsubscribe();
    this.seasonsSub.unsubscribe();
  }

  onTournamentSelected(event: MatSelectChange): void {
    const tournament = event.value as TournamentInfo;
    if (tournament) {
      this.tournamentId = tournament.id;

      this.isLoading = true;
      this.tournamentsService.getTournament(this.tournamentId);
      this.paymentsService.getTournamentEntryFeePaymentDataList(this.tournamentId);
    }
  }

  editPaymentInfo(payment: TournamentEntryFeePaymentData): void {
    this.updatedPayment = {
      id: payment.id,
      golfer_id: payment.golfer_id,
      golfer_name: payment.golfer_name,
      golfer_email: payment.golfer_email,
      year: payment.year,
      tournament_id: payment.tournament_id,
      type: payment.type,
      amount_due: payment.amount_due,
      amount_paid: payment.amount_paid,
      is_paid: payment.is_paid,
      method: payment.method,
      linked_payment_id: payment.linked_payment_id,
      comment: payment.comment,
    };
  }

  updatePaymentInfo(): void {
    if (this.updatedPayment) {
      this.paymentsService
        .updateTournamentEntryFeePayment(this.updatedPayment)
        .subscribe((result) => {
          console.log(`[TournamentEntryFeePaymentsListComponent] Updated payment id=${result.id}`);

          // Update item in list
          const payment = this.tournamentEntryFeePayments.find((entry) => entry.id === result.id);
          if (payment) {
            const newPayment = {
              id: payment.id,
              golfer_id: payment.golfer_id,
              golfer_name: payment.golfer_name,
              golfer_email: payment.golfer_email,
              year: payment.year,
              tournament_id: payment.tournament_id,
              type: payment.type,
              amount_due: result.amount_due,
              amount_paid: result.amount_paid,
              is_paid: result.is_paid,
              method: result.method,
              linked_payment_id: result.linked_payment_id,
              comment: result.comment,
            };

            const paymentIdx = this.tournamentEntryFeePayments.findIndex(
              (entry) => entry.id === result.id,
            );
            this.tournamentEntryFeePayments[paymentIdx] = newPayment;
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

    const data = this.tournamentEntryFeePayments.slice();
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
        case 'tournament_id':
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
    if (!this.tournamentEntryFeePayments) {
      return '';
    }

    let mailToList = '';
    for (const payment of this.tournamentEntryFeePayments) {
      if (
        payment.amount_due > payment.amount_paid &&
        !(payment.method === 'Exempt' || payment.method === 'Linked')
      ) {
        if (payment.golfer_email !== undefined) {
          mailToList += payment.golfer_email + ';';
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
