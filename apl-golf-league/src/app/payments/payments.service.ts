import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { environment } from "../../environments/environment";
import { LeagueDuesPayment } from "../shared/payment.model";

@Injectable({
  providedIn: "root"
})
export class PaymentsService {
  private leagueDuesPaymentsList: LeagueDuesPayment[] = []
  private leagueDuesPaymentsListUpdated = new Subject<LeagueDuesPayment[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getLeagueDuesPaymentsList(year?: number): void {
    let queryParams: string = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http.get<LeagueDuesPayment[]>(environment.apiUrl + "payments/" + queryParams)
      .subscribe(result => {
        this.leagueDuesPaymentsList = result;
        this.leagueDuesPaymentsListUpdated.next(result);
      });
  }

  getLeagueDuesPaymentsListUpdateListener(): Observable<LeagueDuesPayment[]> {
    return this.leagueDuesPaymentsListUpdated.asObservable();
  }

  updateLeagueDuesPayment(payment: LeagueDuesPayment): Observable<LeagueDuesPayment> {
    return this.http.patch<LeagueDuesPayment>(environment.apiUrl + `payments/${payment.id}`, payment);
  }

}
