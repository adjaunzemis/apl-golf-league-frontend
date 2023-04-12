import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, Subscription  } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { PaymentsService } from "../payments.service";
import { AppConfigService } from "../../app-config.service";
import { LeagueDuesPaymentInfo, LeagueDuesPaypalTransaction, LeagueDuesPaypalTransactionItem } from "../../shared/payment.model";
import { GolfersService } from "../../golfers/golfers.service";
import { Golfer } from "../../shared/golfer.model";
import { TournamentsService } from "../../tournaments/tournaments.service";
import { TournamentData } from "../../shared/tournament.model";

declare var paypal: any;

@Component({
  selector: 'app-tournament-entry-fees-payment',
  templateUrl: './tournament-entry-fees-payment.component.html',
  styleUrls: ['./tournament-entry-fees-payment.component.css']
})
export class TournamentEntryFeesPaymentComponent implements OnInit, OnDestroy {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  year: number = 0;

  private leagueDuesPaymentInfoListSub: Subscription;
  private leagueDuesPaymentInfoList: LeagueDuesPaymentInfo[] = [];

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferNameOptionsArray: Observable<string[]>[] = [];

  private tournamentSub: Subscription;
  tournament: TournamentData;

  golferPaymentsForm: FormGroup;

  typeOptions = ['Member', 'Non-Member'];

  isLoadingTournament: boolean = true;
  isLoadingLeagueDuesPaymentInfoList: boolean = true;

  constructor(public dialogRef: MatDialogRef<TournamentEntryFeesPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: { tournamentId: number }, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private appConfigService: AppConfigService, private paymentsService: PaymentsService, private tournamentsService: TournamentsService, private golfersService: GolfersService) {}

  ngOnInit(): void {
    this.year = this.appConfigService.currentYear;

    // Initialize golfer info subscriptions
    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe(golfers => {
      this.golferOptions = golfers;
      this.golferNameOptions = [];
      for (const golfer of golfers) {
        this.golferNameOptions.push(golfer.name);
      }
    });
    this.golfersService.getAllGolfers();

    // Initialize payments info subscriptions
    this.tournamentSub = this.tournamentsService.getTournamentUpdateListener().subscribe(result => {
      this.tournament = result;
      this.isLoadingTournament = false;
    });
    this.tournamentsService.getTournament(this.data.tournamentId);

    this.leagueDuesPaymentInfoListSub = this.paymentsService.getLeagueDuesPaymentInfoListUpdateListener().subscribe(paymentInfoList => {
      this.leagueDuesPaymentInfoList = paymentInfoList;

      this.isLoadingLeagueDuesPaymentInfoList = false;
    });
    this.paymentsService.getLeagueDuesPaymentInfoList(this.year);

    // Initialize golfer payments form
    this.golferPaymentsForm = this.formBuilder.group({
      golferPayments: this.formBuilder.array([])
    });
    this.addNewGolferPaymentForm();

    // Configure PayPal buttons
    paypal
      .Buttons({
        onClick: () => {
          if (!this.golferPaymentsForm.valid) {
            this.snackBar.open("Must complete form before submitting payment!", undefined, {
              duration: 5000,
              panelClass: ["error-snackbar"]
            });
            return false;
          }
          return true;
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: this.getPaymentDescription(),
              amount: {
                currency_code: 'USD',
                value: this.getPaymentTotalAmount()
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();

          // Check for completed status
          if (order.status !== "COMPLETED") {
            this.snackBar.open("ERROR: Payment was not 'COMPLETED' - please contact treasurer or webmaster!", undefined, {
              duration: 10000,
              panelClass: ['error-snackbar']
            });
            return; // leave dialog box open
          }

          // Capture payment details in backend
          try {
            let transactionItems: LeagueDuesPaypalTransactionItem[] = [];
            for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
              const golferControl = golferPaymentForm.get("golfer");
              const golferName = golferControl ? golferControl.value : "unknown";

              const typeControl = golferPaymentForm.get("type");
              const typeName = typeControl ? typeControl.value : "unknown";

              let golferPaymentInfoMatched = false;
              for (const paymentInfo of this.leagueDuesPaymentInfoList) {
                if ((paymentInfo.golfer_name.toLowerCase() === golferName.toLowerCase()) && (paymentInfo.type.toLowerCase() === typeName.toLowerCase())) {
                  golferPaymentInfoMatched = true;

                  transactionItems.push({
                    id: paymentInfo.id,
                    golfer_id: paymentInfo.golfer_id,
                    type: paymentInfo.type
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
                  console.error(`Unable to match golfer option for '${golferName}' - omitting from transaction!`);
                } else {
                  transactionItems.push({
                    golfer_id: paymentGolferId,
                    type: typeName
                  });
                }
              }
            }

            const payerGivenName = order.payer?.name?.given_name ? order.payer.name.given_name : "";
            const payerSurname = order.payer?.name?.surname ? order.payer.name.surname : "";
            const payerEmail = order.payer?.email_address ? order.payer.email_address : "";

            let transaction: LeagueDuesPaypalTransaction = {
              year: this.year,
              amount: order.purchase_units[0].amount.value,
              description: order.purchase_units[0].description,
              items: transactionItems,
              resource_id: order.id,
              update_time: order.update_time,
              payer_name: `${payerGivenName} ${payerSurname}`,
              payer_email: payerEmail
            }

            this.paymentsService.postLeagueDuesPaypalTransaction(transaction).subscribe(() => {
              this.snackBar.open("Payment successful!", undefined, {
                duration: 5000,
                panelClass: ['success-snackbar']
              });
            });
          } catch(err) {
            this.snackBar.open("ERROR: Payment was successful, but not recorded in our database - please contact treasurer or webmaster!", undefined, {
              duration: 10000,
              panelClass: ['error-snackbar']
            });
            console.log(err);
          }

          // Close dialog box
          this.dialogRef.close(true); // true to indicate payment was successful
        },
        onCancel: (data: any) => {
          this.snackBar.open("Payment cancelled!", undefined, {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
        },
        onError: (err: any) => {
          this.snackBar.open("Error processing PayPal payment - please contact treasurer or webmaster!", undefined, {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
          console.error(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }

  ngOnDestroy(): void {
    this.golfersSub.unsubscribe();
    this.tournamentSub.unsubscribe();
    this.leagueDuesPaymentInfoListSub.unsubscribe();
  }

  private getPaymentDescription(): string {
    let description = `APL Golf League Tournament Entry Fees (${this.year}), ${this.tournament.name}, ${this.getGolferPaymentsArray().controls.length} ${this.getGolferPaymentsArray().controls.length > 1 ? "golfers" : "golfer"}`

    // TODO: Re-enable more verbose description with character limit?
    // let description = `APL Golf League Dues (${this.year}) for `
    // for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
    //   const golferControl = golferPaymentForm.get("golfer");
    //   const golferName = golferControl ? golferControl.value : "unknown";

    //   const typeControl = golferPaymentForm.get("type");
    //   const typeName = typeControl ? typeControl.value : "unknown";

    //   description += `${golferName} (${typeName}), `;
    // }
    // description = description.substring(0, description.length - 2);

    return description
  }

  getPaymentTotalAmount(): number {
    let total = 0;
    for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
      if (golferPaymentForm.get("type")?.value === "Member") {
        total += this.tournament.members_entry_fee;
      } else if (golferPaymentForm.get("type")?.value === "Non-Member") {
        total += this.tournament.non_members_entry_fee;
      }
    }
    return total;
  }

  getGolferPaymentsArray(): FormArray {
    return this.golferPaymentsForm.get('golferPayments') as FormArray;
  }

  addNewGolferPaymentForm(): void {
    const newGolferPaymentForm = this.formBuilder.group({
      golfer: new FormControl("", [Validators.required, this.checkGolferName.bind(this)]),
      type: new FormControl("", [Validators.required])
    });
    // }, { validators: this.golferPaymentTypeValidator.bind(this) }); // TODO: re-enable or remove this validation

    this.filteredGolferNameOptionsArray.push(newGolferPaymentForm.controls['golfer'].valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter(value);
      }),
    ));

    this.getGolferPaymentsArray().push(newGolferPaymentForm);
  }

  removeNewGolferPaymentForm(idx: number): void {
    this.getGolferPaymentsArray().removeAt(idx);
    this.filteredGolferNameOptionsArray.splice(idx, 1);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.golferNameOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private checkGolferName(control: FormControl): { [s: string]: boolean } | null {
    if (this.golferNameOptions.indexOf(control.value) === -1) {
      return { 'golferNameInvalid': true };
    }
    return null;
  }

  private golferPaymentTypeValidator(group: FormGroup) {
    const golferControl = group.controls['golfer'];
    const golferName = golferControl.value.toLowerCase();

    const typeControl = group.controls['type'];
    const typeName = typeControl.value.toLowerCase();

    let golferPaymentTypeInvalid = true;
    for (const paymentInfo of this.leagueDuesPaymentInfoList) {
      if ((paymentInfo.golfer_name.toLowerCase() === golferName) && (paymentInfo.type.toLowerCase() === typeName)) {
        golferPaymentTypeInvalid = false;
        break;
      }
    }
    if (golferPaymentTypeInvalid) {
      typeControl.setErrors({ 'golferPaymentTypeInvalid': true });
    }
  }

}
