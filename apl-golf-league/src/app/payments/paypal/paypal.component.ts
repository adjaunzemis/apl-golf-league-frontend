import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  product = {
    price: 777.77,
    description: 'used couch, decent condition'
  };

  paidFor = false;

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
          // console.log(order);
        },
        onError: (err: any) => {
          console.error(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }
}
