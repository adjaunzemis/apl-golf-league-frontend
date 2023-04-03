import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { environment } from "../../environments/environment";
import { LeagueDues, LeagueDuesPaymentData, LeagueDuesPaymentInfo, LeagueDuesPaypalTransaction } from "../shared/payment.model";

@Injectable({
  providedIn: "root"
})
export class PaymentsService {
  private leagueDuesList: LeagueDues[] = []
  private leagueDuesListUpdated = new Subject<LeagueDues[]>();

  private leagueDuesPaymentDataList: LeagueDuesPaymentData[] = []
  private leagueDuesPaymentDataListUpdated = new Subject<LeagueDuesPaymentData[]>();

  private leagueDuesPaymentInfoList: LeagueDuesPaymentInfo[] = []
  private leagueDuesPaymentInfoListUpdated = new Subject<LeagueDuesPaymentInfo[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getLeagueDuesList(year?: number): void {
    let queryParams: string = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http.get<LeagueDues[]>(environment.apiUrl + "payments/dues/amounts" + queryParams)
      .subscribe(result => {
        this.leagueDuesList = result;
        this.leagueDuesListUpdated.next(result);
      });
  }

  getLeagueDuesListUpdateListener(): Observable<LeagueDues[]> {
    return this.leagueDuesListUpdated.asObservable();
  }

  getLeagueDuesPaymentInfoList(year?: number): void {
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

  getLeagueDuesPaymentDataList(year?: number): void {
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

  postLeagueDuesPaypalTransaction(transaction: LeagueDuesPaypalTransaction): Observable<any> {
    return this.http.post(environment.apiUrl + `payments/dues/`, transaction);
  }

}
