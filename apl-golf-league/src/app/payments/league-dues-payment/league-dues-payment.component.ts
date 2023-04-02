import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, Subscription  } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { Golfer } from "../../shared/golfer.model";

declare var paypal: any;

@Component({
  selector: 'app-league-dues-payment',
  templateUrl: './league-dues-payment.component.html',
  styleUrls: ['./league-dues-payment.component.css']
})
export class LeagueDuesPaymentComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  year = 0;
  league_dues_full = 0;
  league_dues_tournament_only = 0;

  golferPaymentsForm: FormGroup;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferOptionsArray: Observable<Golfer[]>[] = [];
  typeOptions = ['Flight Dues', 'Tournament-Only Dues'];

  constructor(public dialogRef: MatDialogRef<LeagueDuesPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: {}, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Initialize golfer payments form
    this.golferPaymentsForm = this.formBuilder.group({
      golferPayments: this.formBuilder.array([])
    });
    this.addNewGolferPaymentForm();

    // Configure PayPal buttons
    paypal
      .Buttons({
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

  private getPaymentDescription(): string {
    let description = `APL Golf League Dues (${this.year}) - `
    // TODO: Add list of golfers and dues types
    // TODO: Trim description if needed (1000 char max?)
    return description
  }

  getPaymentTotalAmount(): number {
    return 123.45; // TODO: total amount due from golfers on form
  }

  getGolferPaymentsArray(): FormArray {
    return this.golferPaymentsForm.get('golferPayments') as FormArray;
  }

  addNewGolferPaymentForm(): void {
    const newGolferPaymentForm = this.formBuilder.group({
      golfer: new FormControl("", [Validators.required, this.checkGolferName.bind(this)]),
      type: new FormControl("", Validators.required)
    });

    this.filteredGolferOptionsArray.push(newGolferPaymentForm.controls['golfer'].valueChanges.pipe(
      startWith(''),
      map(value => {
        if (this.isGolfer(value)) {
          return this._filter(value.name);
        } else {
          return this._filter(value);
        }
      }),
    ));

    this.getGolferPaymentsArray().push(newGolferPaymentForm);
  }

  removeNewGolferPaymentForm(idx: number): void {
    this.getGolferPaymentsArray().removeAt(idx);
    this.filteredGolferOptionsArray.splice(idx, 1);
  }

  private isGolfer(object: any): object is Golfer {
    return (<Golfer> object).name !== undefined;
  }

  private _filter(value: string): Golfer[] {
    const filterValue = value.toLowerCase();
    return this.golferOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private checkGolferName(control: FormControl): { [s: string]: boolean } | null {
    if (this.golferNameOptions.indexOf(control.value) === -1) {
      return { 'golferNameInvalid': true };
    }
    return null;
  }

}
