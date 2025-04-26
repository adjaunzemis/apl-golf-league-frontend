/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { PaymentsService } from '../payments.service';
import {
  TournamentEntryFeePaymentInfo,
  TournamentEntryFeePaypalTransaction,
  TournamentEntryFeePaypalTransactionItem,
} from '../../shared/payment.model';
import { GolfersService } from '../../golfers/golfers.service';
import { Golfer } from '../../shared/golfer.model';
import { TournamentsService } from '../../tournaments/tournaments.service';
import { TournamentData, TournamentInfo } from '../../shared/tournament.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { NotificationService } from 'src/app/notifications/notification.service';

declare let paypal: any;

@Component({
  selector: 'app-tournament-entry-fees-payment',
  templateUrl: './tournament-entry-fees-payment.component.html',
  styleUrls: ['./tournament-entry-fees-payment.component.css'],
  standalone: false,
})
export class TournamentEntryFeesPaymentComponent implements OnInit, OnDestroy {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  year = 0;
  private seasonsSub: Subscription;

  tournamentId = -1;

  private tournamentEntryFeePaymentInfoListSub: Subscription;
  private tournamentEntryFeePaymentInfoList: TournamentEntryFeePaymentInfo[] = [];

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferNameOptionsArray: Observable<string[]>[] = [];

  private tournamentOptionsSub: Subscription;
  tournamentOptions: TournamentInfo[];

  private tournamentSub: Subscription;
  tournament: TournamentData;

  golferPaymentsForm: UntypedFormGroup;

  typeOptions = ['Member Fee', 'Non-Member Fee'];

  isLoadingTournament = true;
  isLoadingTournamentEntryFeePaymentInfoList = true;

  constructor(
    public dialogRef: MatDialogRef<TournamentEntryFeesPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object,
    private formBuilder: UntypedFormBuilder,
    private notificationService: NotificationService,
    private paymentsService: PaymentsService,
    private tournamentsService: TournamentsService,
    private golfersService: GolfersService,
    private seasonsService: SeasonsService,
  ) {}

  ngOnInit(): void {
    this.tournamentOptionsSub = this.tournamentsService
      .getListUpdateListener()
      .subscribe((result) => {
        this.tournamentOptions = [...result];
      });

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.year = result.year;

      this.tournamentsService.getList(this.year);
    });

    // Initialize golfer info subscriptions
    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((golfers) => {
      this.golferOptions = golfers;
      this.golferNameOptions = [];
      for (const golfer of golfers) {
        this.golferNameOptions.push(golfer.name);
      }
    });
    this.golfersService.getAllGolfers();

    // Initialize payments info subscriptions
    this.tournamentSub = this.tournamentsService
      .getTournamentUpdateListener()
      .subscribe((result) => {
        this.tournament = result;
        this.isLoadingTournament = false;
      });

    this.tournamentEntryFeePaymentInfoListSub = this.paymentsService
      .getTournamentEntryFeePaymentInfoListUpdateListener()
      .subscribe((paymentInfoList) => {
        this.tournamentEntryFeePaymentInfoList = paymentInfoList;

        this.isLoadingTournamentEntryFeePaymentInfoList = false;
      });

    // Initialize golfer payments form
    this.golferPaymentsForm = this.formBuilder.group({
      golferPayments: this.formBuilder.array([]),
    });
    this.addNewGolferPaymentForm();

    // Configure PayPal buttons
    paypal
      .Buttons({
        onClick: () => {
          if (!this.golferPaymentsForm.valid) {
            this.notificationService.showError(
              'Payment Error',
              'Must complete form before submitting payment!',
              10000,
            );
            return false;
          }
          return true;
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

          // Check for completed status
          if (order.status !== 'COMPLETED') {
            this.notificationService.showError(
              'Paymnent Error',
              "ERROR: Payment was not 'COMPLETED' - please contact treasurer or webmaster!",
              10000,
            );
            return; // leave dialog box open
          }

          // Capture payment details in backend
          try {
            const transactionItems: TournamentEntryFeePaypalTransactionItem[] = [];
            for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
              const golferControl = golferPaymentForm.get('golfer');
              const golferName = golferControl ? golferControl.value : 'unknown';

              const typeControl = golferPaymentForm.get('type');
              const typeName = typeControl ? typeControl.value : 'unknown';

              let golferPaymentInfoMatched = false;
              for (const paymentInfo of this.tournamentEntryFeePaymentInfoList) {
                if (
                  paymentInfo.golfer_name.toLowerCase() === golferName.toLowerCase() &&
                  paymentInfo.type.toLowerCase() === typeName.toLowerCase()
                ) {
                  golferPaymentInfoMatched = true;

                  transactionItems.push({
                    id: paymentInfo.id,
                    golfer_id: paymentInfo.golfer_id,
                    type: paymentInfo.type,
                  });

                  break;
                }
              }

              if (!golferPaymentInfoMatched) {
                // Create new payment item (omit payment id)
                let paymentGolferId = -1;
                for (const golfer of this.golferOptions) {
                  if (golfer.name.toLowerCase() === golferName.toLowerCase()) {
                    paymentGolferId = golfer.id;
                  }
                }
                if (paymentGolferId === -1) {
                  console.error(
                    `Unable to match golfer option for '${golferName}' - omitting from transaction!`,
                  );
                } else {
                  transactionItems.push({
                    golfer_id: paymentGolferId,
                    type: typeName,
                  });
                }
              }
            }

            const payerGivenName = order.payer?.name?.given_name ? order.payer.name.given_name : '';
            const payerSurname = order.payer?.name?.surname ? order.payer.name.surname : '';
            const payerEmail = order.payer?.email_address ? order.payer.email_address : '';

            const transaction: TournamentEntryFeePaypalTransaction = {
              year: this.year,
              tournament_id: this.tournamentId,
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
                  'Successful Payment',
                  'Payment successful!',
                  5000,
                );
              });
          } catch (err) {
            this.notificationService.showError(
              'Payment Error',
              'Payment was successful, but not recorded in our database - please contact treasurer or webmaster!',
              10000,
            );
            console.log(err);
          }

          // Close dialog box
          this.dialogRef.close(true); // true to indicate payment was successful
        },
        onCancel: () => {
          this.notificationService.showWarning('Payment Canceled', 'Payment cancelled!', 5000);
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
    this.seasonsSub.unsubscribe();
    this.golfersSub.unsubscribe();
    this.tournamentOptionsSub.unsubscribe();
    this.tournamentSub.unsubscribe();
    this.tournamentEntryFeePaymentInfoListSub.unsubscribe();
  }

  onTournamentSelected(event: MatSelectChange): void {
    const tournament = event.value as TournamentInfo;
    if (tournament) {
      this.tournamentId = tournament.id;

      this.isLoadingTournament = true;
      this.tournamentsService.getTournament(this.tournamentId);

      this.isLoadingTournamentEntryFeePaymentInfoList = true;
      this.paymentsService.getTournamentEntryFeePaymentInfoList(this.tournamentId);
    }
  }

  private getPaymentDescription(): string {
    const description = `APL Golf League Tournament Entry Fees (${this.year}, ${this.tournament.name}), ${this.getGolferPaymentsArray().controls.length} ${this.getGolferPaymentsArray().controls.length > 1 ? 'golfers' : 'golfer'}`;

    // TODO: Re-enable more verbose description with character limit?
    // let description = `APL Golf League Tournament Entry Fees (${this.year}, ${this.tournament.name}) for `
    // for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
    //   const golferControl = golferPaymentForm.get("golfer");
    //   const golferName = golferControl ? golferControl.value : "unknown";

    //   const typeControl = golferPaymentForm.get("type");
    //   const typeName = typeControl ? typeControl.value : "unknown";

    //   description += `${golferName} (${typeName}), `;
    // }
    // description = description.substring(0, description.length - 2);

    return description;
  }

  getPaymentTotalAmount(): number {
    let total = 0;
    for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
      if (golferPaymentForm.get('type')?.value === 'Member Fee') {
        total += this.tournament.members_entry_fee;
      } else if (golferPaymentForm.get('type')?.value === 'Non-Member Fee') {
        total += this.tournament.non_members_entry_fee;
      }
    }
    return total;
  }

  getGolferPaymentsArray(): UntypedFormArray {
    return this.golferPaymentsForm.get('golferPayments') as UntypedFormArray;
  }

  addNewGolferPaymentForm(): void {
    const newGolferPaymentForm = this.formBuilder.group({
      golfer: new UntypedFormControl('', [Validators.required, this.checkGolferName.bind(this)]),
      type: new UntypedFormControl('', [Validators.required]),
    });
    // }, { validators: this.golferPaymentTypeValidator.bind(this) }); // TODO: re-enable or remove this validation

    this.filteredGolferNameOptionsArray.push(
      newGolferPaymentForm.controls['golfer'].valueChanges.pipe(
        startWith(''),
        map((value) => {
          return this._filter(value);
        }),
      ),
    );

    this.getGolferPaymentsArray().push(newGolferPaymentForm);
  }

  removeNewGolferPaymentForm(idx: number): void {
    this.getGolferPaymentsArray().removeAt(idx);
    this.filteredGolferNameOptionsArray.splice(idx, 1);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.golferNameOptions.filter((option) => option.toLowerCase().includes(filterValue));
  }

  private checkGolferName(control: UntypedFormControl): Record<string, boolean> | null {
    if (this.golferNameOptions.indexOf(control.value) === -1) {
      return { golferNameInvalid: true };
    }
    return null;
  }

  private golferPaymentTypeValidator(group: UntypedFormGroup) {
    const golferControl = group.controls['golfer'];
    const golferName = golferControl.value.toLowerCase();

    const typeControl = group.controls['type'];
    const typeName = typeControl.value.toLowerCase();

    let golferPaymentTypeInvalid = true;
    for (const paymentInfo of this.tournamentEntryFeePaymentInfoList) {
      if (
        paymentInfo.golfer_name.toLowerCase() === golferName &&
        paymentInfo.type.toLowerCase() === typeName
      ) {
        golferPaymentTypeInvalid = false;
        break;
      }
    }
    if (golferPaymentTypeInvalid) {
      typeControl.setErrors({ golferPaymentTypeInvalid: true });
    }
  }
}
