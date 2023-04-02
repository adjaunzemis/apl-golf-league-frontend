import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

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

  constructor(public dialogRef: MatDialogRef<LeagueDuesPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: {}, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: this.getPaymentDescription(),
              amount: {
                currency_code: 'USD',
                value: this.getPaymentTotal()
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

  getPaymentTotal(): number {
    return 123.45; // TODO: total amount due from golfers on form
  }

}
