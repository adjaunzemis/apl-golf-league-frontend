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
  LeagueDuesPaymentInfo,
  LeagueDuesPaypalTransaction,
  LeagueDuesPaypalTransactionItem,
} from '../../shared/payment.model';
import { GolfersService } from '../../golfers/golfers.service';
import { Golfer } from '../../shared/golfer.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { PrimeNGModule } from '../../primeng.module';

declare let paypal: any;

@Component({
  selector: 'app-league-dues-payment',
  templateUrl: './league-dues-payment.component.html',
  styleUrls: ['./league-dues-payment.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeNGModule],
})
export class LeagueDuesPaymentComponent implements OnInit, OnDestroy {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private formBuilder = inject(UntypedFormBuilder);
  private notificationService = inject(NotificationService);
  private paymentsService = inject(PaymentsService);
  private golfersService = inject(GolfersService);
  private seasonsService = inject(SeasonsService);

  year = 0;
  private seasonsSub: Subscription;

  leagueDuesFlight = 0;
  leagueDuesTournamentOnly = 0;

  private leagueDuesListSub: Subscription;
  private leagueDuesPaymentInfoListSub: Subscription;
  private leagueDuesPaymentInfoList: LeagueDuesPaymentInfo[] = [];

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferNameOptionsArray: string[][] = [];

  golferPaymentsForm: UntypedFormGroup;

  typeOptions = ['Flight Dues', 'Tournament-Only Dues'];

  isLoadingLeagueDuesList = true;
  isLoadingLeagueDuesPaymentInfoList = true;

  ngOnInit(): void {
    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((golfers) => {
      this.golferOptions = golfers;
      this.golferNameOptions = [];
      for (const golfer of golfers) {
        this.golferNameOptions.push(golfer.name);
      }
    });
    this.golfersService.getAllGolfers();

    this.leagueDuesListSub = this.paymentsService
      .getLeagueDuesListUpdateListener()
      .subscribe((leagueDues) => {
        for (const dues of leagueDues) {
          if (dues.type == 'Flight Dues') {
            this.leagueDuesFlight = dues.amount;
          } else if (dues.type == 'Tournament-Only Dues') {
            this.leagueDuesTournamentOnly = dues.amount;
          }
        }
        this.isLoadingLeagueDuesList = false;
      });

    this.leagueDuesPaymentInfoListSub = this.paymentsService
      .getLeagueDuesPaymentInfoListUpdateListener()
      .subscribe((paymentInfoList) => {
        this.leagueDuesPaymentInfoList = paymentInfoList;

        this.isLoadingLeagueDuesPaymentInfoList = false;
      });

    this.golferPaymentsForm = this.formBuilder.group({
      golferPayments: this.formBuilder.array([]),
    });
    this.addNewGolferPaymentForm();

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.year = result.year;

      this.paymentsService.getLeagueDuesList(this.year);
      this.paymentsService.getLeagueDuesPaymentInfoList(this.year);
    });

    // Configure PayPal buttons
    paypal
      .Buttons({
        onClick: (data: any, actions: any) => {
          if (!this.golferPaymentsForm.valid) {
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

          // Check for completed status
          if (order.status !== 'COMPLETED') {
            this.notificationService.showError(
              'Payment Error',
              "ERROR: Payment was not 'COMPLETED' - please contact treasurer or webmaster!",
              10000,
            );
            return; // leave dialog box open
          }

          // Capture payment details in backend
          try {
            const transactionItems: LeagueDuesPaypalTransactionItem[] = [];
            for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
              const golferControl = golferPaymentForm.get('golfer');
              const golferName = golferControl ? golferControl.value : 'unknown';

              const typeControl = golferPaymentForm.get('type');
              const typeName = typeControl ? typeControl.value : 'unknown';

              let golferPaymentInfoMatched = false;
              for (const paymentInfo of this.leagueDuesPaymentInfoList) {
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

            const transaction: LeagueDuesPaypalTransaction = {
              year: this.year,
              amount: order.purchase_units[0].amount.value,
              description: order.purchase_units[0].description,
              items: transactionItems,
              resource_id: order.id,
              update_time: order.update_time,
              payer_name: `${payerGivenName} ${payerSurname}`,
              payer_email: payerEmail,
            };

            this.paymentsService.postLeagueDuesPaypalTransaction(transaction).subscribe(() => {
              this.notificationService.showSuccess(
                'Payment Success',
                'Payment was successful!',
                5000,
              );
            });
          } catch (err) {
            this.notificationService.showError(
              'Payment Error',
              'ERROR: Payment was successful, but not recorded in our database - please contact treasurer or webmaster!',
              10000,
            );
            console.log(err);
          }

          // Close dialog box
          this.ref.close(true); // true to indicate payment was successful
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
    this.golfersSub.unsubscribe();
    this.leagueDuesListSub.unsubscribe();
    this.leagueDuesPaymentInfoListSub.unsubscribe();
    this.seasonsSub.unsubscribe();
  }

  private getPaymentDescription(): string {
    const description = `APL Golf League Dues (${this.year}), ${this.getGolferPaymentsArray().controls.length} ${this.getGolferPaymentsArray().controls.length > 1 ? 'golfers' : 'golfer'}`;
    return description;
  }

  getPaymentTotalAmount(): number {
    let total = 0;
    for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
      if (golferPaymentForm.get('type')?.value === 'Flight Dues') {
        total += this.leagueDuesFlight;
      } else if (golferPaymentForm.get('type')?.value === 'Tournament-Only Dues') {
        total += this.leagueDuesTournamentOnly;
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
