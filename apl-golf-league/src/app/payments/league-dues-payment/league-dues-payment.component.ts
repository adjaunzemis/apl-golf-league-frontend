import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, Subscription  } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { PaymentsService } from "../payments.service";
import { AppConfigService } from "../../app-config.service";
import { LeagueDuesPaymentInfo } from "src/app/shared/payment.model";

declare var paypal: any;

@Component({
  selector: 'app-league-dues-payment',
  templateUrl: './league-dues-payment.component.html',
  styleUrls: ['./league-dues-payment.component.css']
})
export class LeagueDuesPaymentComponent implements OnInit, OnDestroy {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  year = 0;
  leagueDuesFlight = 0;
  leagueDuesTournamentOnly = 0;

  private leagueDuesListSub: Subscription;
  private leagueDuesPaymentInfoListSub: Subscription;
  private leagueDuesPaymentInfoList: LeagueDuesPaymentInfo[] = [];

  golferPaymentsForm: FormGroup;
  golferNameOptions: string[] = [];
  filteredGolferNameOptionsArray: Observable<string[]>[] = [];

  typeOptions = ['Flight Dues', 'Tournament-Only Dues'];

  isLoadingLeagueDuesList: boolean = true;
  isLoadingLeagueDuesPaymentInfoList: boolean = true;

  constructor(public dialogRef: MatDialogRef<LeagueDuesPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: {}, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private appConfigService: AppConfigService, private paymentsService: PaymentsService) {}

  ngOnInit(): void {
    this.year = this.appConfigService.currentYear;

    // Initialize payments info subscriptions
    this.leagueDuesListSub = this.paymentsService.getLeagueDuesListUpdateListener().subscribe(leagueDues => {
      for (const dues of leagueDues) {
        if (dues.type == "Flight Dues") {
          this.leagueDuesFlight = dues.amount;
        }
        else if (dues.type == "Tournament-Only Dues") {
          this.leagueDuesTournamentOnly = dues.amount;
        }
      }
      this.isLoadingLeagueDuesList = false;
    });
    this.paymentsService.getLeagueDuesList(this.year);

    this.leagueDuesPaymentInfoListSub = this.paymentsService.getLeagueDuesPaymentInfoListUpdateListener().subscribe(paymentInfoList => {
      this.leagueDuesPaymentInfoList = paymentInfoList;

      this.golferNameOptions = [];
      for (const paymentInfo of paymentInfoList) {
        if (paymentInfo.amount_due > paymentInfo.amount_paid) {
          this.golferNameOptions.push(paymentInfo.golfer_name);
        }
      }

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
          this.snackBar.open("Payment successful!", undefined, {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          // TODO: Capture payment details in backend
          console.log(order);
          this.dialogRef.close(true); // true to indicate payment was successful
        },
        onCancel: (data: any) => {
          this.snackBar.open("Payment cancelled!", undefined, {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
        },
        onError: (err: any) => {
          this.snackBar.open("Error processing PayPal payment!", undefined, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }

  ngOnDestroy(): void {
    this.leagueDuesListSub.unsubscribe();
    this.leagueDuesPaymentInfoListSub.unsubscribe();
  }

  private getPaymentDescription(): string {
    let description = `APL Golf League Dues (${this.year}) for `
    for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
      const golferControl = golferPaymentForm.get("golfer");
      const golferName = golferControl ? golferControl.value : "unknown";

      const typeControl = golferPaymentForm.get("type");
      const typeName = typeControl ? typeControl.value : "unknown";

      description += `${golferName} (${typeName}), `;
    }
    description = description.substring(0, description.length - 2);
    return description
  }

  getPaymentTotalAmount(): number {
    let total = 0;
    for (const golferPaymentForm of this.getGolferPaymentsArray().controls) {
      if (golferPaymentForm.get("type")?.value === "Flight Dues") {
        total += this.leagueDuesFlight;
      } else if (golferPaymentForm.get("type")?.value === "Tournament-Only Dues") {
        total += this.leagueDuesTournamentOnly;
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
    }, { validators: this.golferPaymentTypeValidator.bind(this) });

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
      if (paymentInfo.golfer_name.toLowerCase() === golferName) {
        if (paymentInfo.type.toLowerCase() === typeName) {
          golferPaymentTypeInvalid = false;
          break;
        }
      }
    }
    if (golferPaymentTypeInvalid) {
      typeControl.setErrors({ 'golferPaymentTypeInvalid': true });
    }
  }

}
