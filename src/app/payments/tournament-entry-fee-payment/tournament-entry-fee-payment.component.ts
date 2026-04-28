/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/notifications/notification.service';
import { PaymentsService } from '../payments.service';
import {
  TournamentEntryFeePaymentInfo,
  TournamentEntryFeePaypalTransaction,
  LeagueDuesPaypalTransactionItem,
} from '../../shared/payment.model';
import { GolfersService } from '../../golfers/golfers.service';
import { Golfer } from '../../shared/golfer.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { TournamentsService } from 'src/app/tournaments/tournaments.service';
import { TournamentInfo } from 'src/app/shared/tournament.model';
import { PrimeNGModule } from '../../primeng.module';

declare let paypal: any;

@Component({
  selector: 'app-tournament-entry-fee-payment',
  templateUrl: './tournament-entry-fee-payment.component.html',
  styleUrls: ['./tournament-entry-fee-payment.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeNGModule],
})
export class TournamentEntryFeePaymentComponent implements OnInit, OnDestroy {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private formBuilder = inject(UntypedFormBuilder);
  private notificationService = inject(NotificationService);
  private paymentsService = inject(PaymentsService);
  private golfersService = inject(GolfersService);
  private seasonsService = inject(SeasonsService);
  private tournamentsService = inject(TournamentsService);

  year = 0;
  private seasonsSub: Subscription;

  tournaments: TournamentInfo[] = [];
  selectedTournament: TournamentInfo | null = null;
  private tournamentsSub: Subscription;

  private tournamentEntryFeePaymentInfoListSub: Subscription;
  private tournamentEntryFeePaymentInfoList: TournamentEntryFeePaymentInfo[] = [];

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferNameOptionsArray: string[][] = [];

  tournamentPaymentForm: UntypedFormGroup;

  typeOptions = ['Member', 'Non-Member'];

  isLoadingTournaments = true;
  isLoadingPaymentInfoList = false;

  ngOnInit(): void {
    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((golfers) => {
      this.golferOptions = golfers;
      this.golferNameOptions = golfers.map((g) => g.name);
    });
    this.golfersService.getAllGolfers();

    this.tournamentsSub = this.tournamentsService
      .getListUpdateListener()
      .subscribe((tournaments) => {
        this.tournaments = tournaments;
        this.isLoadingTournaments = false;
      });

    this.tournamentEntryFeePaymentInfoListSub = this.paymentsService
      .getTournamentEntryFeePaymentInfoListUpdateListener()
      .subscribe((paymentInfoList) => {
        this.tournamentEntryFeePaymentInfoList = paymentInfoList;
        this.isLoadingPaymentInfoList = false;
      });

    this.tournamentPaymentForm = this.formBuilder.group({
      tournament: new UntypedFormControl(null, [Validators.required]),
      golferPayments: this.formBuilder.array([]),
    });

    this.tournamentPaymentForm
      .get('tournament')
      ?.valueChanges.subscribe((tournament: TournamentInfo) => {
        this.selectedTournament = tournament;
        if (tournament) {
          this.isLoadingPaymentInfoList = true;
          this.paymentsService.getTournamentEntryFeePaymentInfoList(tournament.id);
        }
      });

    this.addNewGolferPaymentForm();

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.year = result.year;
      this.tournamentsService.getList(this.year);
    });

    // Configure PayPal buttons
    paypal
      .Buttons({
        onClick: (data: any, actions: any) => {
          if (!this.tournamentPaymentForm.valid) {
            this.notificationService.showError(
              'Payment Error',
              'Must complete form before submitting payment!',
              5000,
            );
            return actions.reject();
          }
          return actions.resolve();
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.getPaymentDescription(),
                amount: {
                  currency_code: 'USD',
                  value: this.getPaymentTotalAmount(),
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();

          if (order.status !== 'COMPLETED') {
            this.notificationService.showError(
              'Payment Error',
              "ERROR: Payment was not 'COMPLETED' - please contact treasurer or webmaster!",
              10000,
            );
            return;
          }

          try {
            const transactionItems: LeagueDuesPaypalTransactionItem[] = [];
            for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
              const golferName = golferPaymentForm.get('golfer')?.value;
              const type = golferPaymentForm.get('type')?.value;

              let matched = false;
              for (const info of this.tournamentEntryFeePaymentInfoList) {
                if (
                  info.golfer_name.toLowerCase() === golferName.toLowerCase() &&
                  info.type.toLowerCase() === type.toLowerCase()
                ) {
                  matched = true;
                  transactionItems.push({
                    id: info.id,
                    golfer_id: info.golfer_id,
                    type: info.type,
                  });
                  break;
                }
              }

              if (!matched) {
                const golfer = this.golferOptions.find(
                  (g) => g.name.toLowerCase() === golferName.toLowerCase(),
                );
                if (golfer) {
                  transactionItems.push({
                    golfer_id: golfer.id,
                    type: type,
                  });
                }
              }
            }

            const payerGivenName = order.payer?.name?.given_name || '';
            const payerSurname = order.payer?.name?.surname || '';
            const payerEmail = order.payer?.email_address || '';

            const transaction: TournamentEntryFeePaypalTransaction = {
              year: this.year,
              tournament_id: this.selectedTournament?.id || 0,
              amount: order.purchase_units[0].amount.value,
              description: order.purchase_units[0].description,
              items: transactionItems,
              resource_id: order.id,
              update_time: order.update_time,
              payer_name: `${payerGivenName} ${payerSurname}`,
              payer_email: payerEmail,
            };

            this.paymentsService
              .postTournamentEntryFeePaypalTransaction(transaction)
              .subscribe(() => {
                this.notificationService.showSuccess(
                  'Payment Success',
                  'Payment was successful!',
                  5000,
                );
                this.ref.close(true);
              });
          } catch (err) {
            this.notificationService.showError(
              'Payment Error',
              'ERROR: Payment was successful, but not recorded in our database - please contact treasurer or webmaster!',
              10000,
            );
            console.error(err);
          }
        },
        onCancel: () => {
          this.notificationService.showWarning('Payment Cancelled', 'Payment cancelled!', 5000);
        },
        onError: (err: any) => {
          this.notificationService.showError(
            'Payment Error',
            'Error processing PayPal payment - please contact treasurer or webmaster!',
            10000,
          );
          console.error(err);
        },
      })
      .render(this.paypalElement.nativeElement);
  }

  ngOnDestroy(): void {
    this.golfersSub?.unsubscribe();
    this.tournamentsSub?.unsubscribe();
    this.tournamentEntryFeePaymentInfoListSub?.unsubscribe();
    this.seasonsSub?.unsubscribe();
  }

  private getPaymentDescription(): string {
    return `APL Tournament Entry Fee (${this.selectedTournament?.name}), ${this.getGolferPaymentsArray().length} ${this.getGolferPaymentsArray().length > 1 ? 'golfers' : 'golfer'}`;
  }

  getPaymentTotalAmount(): number {
    if (!this.selectedTournament) return 0;
    let total = 0;
    for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
      const type = golferPaymentForm.get('type')?.value;
      if (type === 'Member') {
        total += this.selectedTournament.members_entry_fee;
      } else if (type === 'Non-Member') {
        total += this.selectedTournament.non_members_entry_fee;
      }
    }
    return total;
  }

  getGolferPaymentsArray(): UntypedFormArray {
    return this.tournamentPaymentForm.get('golferPayments') as UntypedFormArray;
  }

  addNewGolferPaymentForm(): void {
    const newGolferPaymentForm = this.formBuilder.group({
      golfer: new UntypedFormControl('', [Validators.required, this.checkGolferName.bind(this)]),
      type: new UntypedFormControl('Member', [Validators.required]),
    });

    this.getGolferPaymentsArray().push(newGolferPaymentForm);
    this.filteredGolferNameOptionsArray.push([]);
  }

  removeNewGolferPaymentForm(idx: number): void {
    this.getGolferPaymentsArray().removeAt(idx);
    this.filteredGolferNameOptionsArray.splice(idx, 1);
  }

  filterGolfers(event: any, idx: number): void {
    const query = event.query.toLowerCase();
    this.filteredGolferNameOptionsArray[idx] = this.golferNameOptions.filter((option) =>
      option.toLowerCase().includes(query),
    );
  }

  onCancelClick(): void {
    this.ref.close();
  }

  private checkGolferName(control: UntypedFormControl): Record<string, boolean> | null {
    if (this.golferNameOptions.indexOf(control.value) === -1) {
      return { golferNameInvalid: true };
    }
    return null;
  }
}
