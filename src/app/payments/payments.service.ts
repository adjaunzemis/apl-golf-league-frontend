import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  LeagueDues,
  LeagueDuesPaymentData,
  LeagueDuesPaymentInfo,
  LeagueDuesPaypalTransaction,
  TournamentEntryFeePaymentData,
  TournamentEntryFeePaymentInfo,
  TournamentEntryFeePaypalTransaction,
} from '../shared/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private leagueDuesList: LeagueDues[] = [];
  private leagueDuesListUpdated = new Subject<LeagueDues[]>();

  private leagueDuesPaymentDataList: LeagueDuesPaymentData[] = [];
  private leagueDuesPaymentDataListUpdated = new Subject<LeagueDuesPaymentData[]>();

  private leagueDuesPaymentInfoList: LeagueDuesPaymentInfo[] = [];
  private leagueDuesPaymentInfoListUpdated = new Subject<LeagueDuesPaymentInfo[]>();

  private tournamentEntryFeePaymentDataList: TournamentEntryFeePaymentData[] = [];
  private tournamentEntryFeePaymentDataListUpdated = new Subject<TournamentEntryFeePaymentData[]>();

  private tournamentEntryFeePaymentInfoList: TournamentEntryFeePaymentInfo[] = [];
  private tournamentEntryFeePaymentInfoListUpdated = new Subject<TournamentEntryFeePaymentInfo[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /** LEAGUE DUES */
  getLeagueDuesList(year?: number): void {
    let queryParams = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http
      .get<LeagueDues[]>(environment.apiUrl + 'payments/dues/amounts' + queryParams)
      .subscribe((result) => {
        this.leagueDuesList = result;
        this.leagueDuesListUpdated.next(result);
      });
  }

  getLeagueDuesListUpdateListener(): Observable<LeagueDues[]> {
    return this.leagueDuesListUpdated.asObservable();
  }

  getLeagueDuesPaymentInfoList(year?: number): void {
    let queryParams = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http
      .get<LeagueDuesPaymentInfo[]>(environment.apiUrl + 'payments/dues/info' + queryParams)
      .subscribe((result) => {
        this.leagueDuesPaymentInfoList = result;
        this.leagueDuesPaymentInfoListUpdated.next(result);
      });
  }

  getLeagueDuesPaymentInfoListUpdateListener(): Observable<LeagueDuesPaymentInfo[]> {
    return this.leagueDuesPaymentInfoListUpdated.asObservable();
  }

  getLeagueDuesPaymentDataList(year?: number): void {
    let queryParams = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http
      .get<LeagueDuesPaymentData[]>(environment.apiUrl + 'payments/dues/data' + queryParams)
      .subscribe((result) => {
        this.leagueDuesPaymentDataList = result;
        this.leagueDuesPaymentDataListUpdated.next(result);
      });
  }

  getLeagueDuesPaymentDataListUpdateListener(): Observable<LeagueDuesPaymentData[]> {
    return this.leagueDuesPaymentDataListUpdated.asObservable();
  }

  updateLeagueDuesPayment(payment: LeagueDuesPaymentData): Observable<LeagueDuesPaymentData> {
    return this.http.patch<LeagueDuesPaymentData>(
      environment.apiUrl + `payments/dues/${payment.id}`,
      payment,
    );
  }

  postLeagueDuesPaypalTransaction(transaction: LeagueDuesPaypalTransaction): Observable<any> {
    return this.http.post(environment.apiUrl + `payments/dues/`, transaction);
  }

  /** TOURNAMENT ENTRY FEES */
  getTournamentEntryFeePaymentInfoList(tournament_id: number): void {
    this.http
      .get<
        TournamentEntryFeePaymentInfo[]
      >(environment.apiUrl + `payments/fees/info/${tournament_id}`)
      .subscribe((result) => {
        this.tournamentEntryFeePaymentInfoList = result;
        this.tournamentEntryFeePaymentInfoListUpdated.next(result);
      });
  }

  getTournamentEntryFeePaymentInfoListUpdateListener(): Observable<
    TournamentEntryFeePaymentInfo[]
  > {
    return this.tournamentEntryFeePaymentInfoListUpdated.asObservable();
  }

  getTournamentEntryFeePaymentDataList(tournament_id: number): void {
    this.http
      .get<
        TournamentEntryFeePaymentData[]
      >(environment.apiUrl + `payments/fees/data/${tournament_id}`)
      .subscribe((result) => {
        this.tournamentEntryFeePaymentDataList = result;
        this.tournamentEntryFeePaymentDataListUpdated.next(result);
      });
  }

  getTournamentEntryFeePaymentDataListUpdateListener(): Observable<
    TournamentEntryFeePaymentData[]
  > {
    return this.tournamentEntryFeePaymentDataListUpdated.asObservable();
  }

  updateTournamentEntryFeePayment(
    payment: TournamentEntryFeePaymentData,
  ): Observable<TournamentEntryFeePaymentData> {
    return this.http.patch<TournamentEntryFeePaymentData>(
      environment.apiUrl + `payments/fees/${payment.id}`,
      payment,
    );
  }

  postTournamentEntryFeePaypalTransaction(
    transaction: TournamentEntryFeePaypalTransaction,
  ): Observable<any> {
    return this.http.post(environment.apiUrl + `payments/fees/`, transaction);
  }
}
