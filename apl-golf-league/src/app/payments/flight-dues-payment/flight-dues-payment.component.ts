import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

declare var paypal: any;

@Component({
  selector: 'app-flight-dues-payment',
  templateUrl: './flight-dues-payment.component.html',
  styleUrls: ['./flight-dues-payment.component.css']
})
export class FlightDuesPaymentComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  product = {
    price: 777.77,
    description: 'used couch, decent condition'
  };
  paidFor = false;

  constructor(public dialogRef: MatDialogRef<FlightDuesPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: {}, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: this.product.description,
              amount: {
                currency_code: 'USD',
                value: this.product.price
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          this.snackBar.open("Payment successful!", undefined, {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          console.log(order);
        },
        onCancel: (data: any) => {
          this.snackBar.open("Payment cancelled!", undefined, {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
        },
        onError: (err: any) => {
          console.error(`[PaypalComponent] Error processing order`)
          this.snackBar.open("Error processing PayPal payment!", undefined, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }
}
