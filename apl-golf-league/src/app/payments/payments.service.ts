import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { environment } from "../../environments/environment";
import { LeagueDuesPaymentData, LeagueDuesPaymentInfo } from "../shared/payment.model";

@Injectable({
  providedIn: "root"
})
export class PaymentsService {
  private leagueDuesPaymentDataList: LeagueDuesPaymentData[] = []
  private leagueDuesPaymentDataListUpdated = new Subject<LeagueDuesPaymentData[]>();

  private leagueDuesPaymentInfoList: LeagueDuesPaymentInfo[] = []
  private leagueDuesPaymentInfoListUpdated = new Subject<LeagueDuesPaymentInfo[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getLeagueDuesPaymentDataList(year?: number): void {
    let queryParams: string = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http.get<LeagueDuesPaymentInfo[]>(environment.apiUrl + "payments/dues/info" + queryParams)
      .subscribe(result => {
        this.leagueDuesPaymentInfoList = result;
        this.leagueDuesPaymentInfoListUpdated.next(result);
      });
  }

  getLeagueDuesPaymentInfoListUpdateListener(): Observable<LeagueDuesPaymentInfo[]> {
    return this.leagueDuesPaymentInfoListUpdated.asObservable();
  }

  getLeagueDuesPaymentInfoList(year?: number): void {
    let queryParams: string = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http.get<LeagueDuesPaymentData[]>(environment.apiUrl + "payments/dues/data" + queryParams)
      .subscribe(result => {
        this.leagueDuesPaymentDataList = result;
        this.leagueDuesPaymentDataListUpdated.next(result);
      });
  }

  getLeagueDuesPaymentDataListUpdateListener(): Observable<LeagueDuesPaymentData[]> {
    return this.leagueDuesPaymentDataListUpdated.asObservable();
  }

  updateLeagueDuesPayment(payment: LeagueDuesPaymentData): Observable<LeagueDuesPaymentData> {
    return this.http.patch<LeagueDuesPaymentData>(environment.apiUrl + `payments/${payment.id}`, payment);
  }

}
