import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { Round, RoundData } from '../shared/round.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoundsService {
  private roundsData: RoundData[] = [];
  private roundsDataUpdated = new Subject<RoundData[]>();

  private selectedRound: Round;
  private selectedRoundUpdated = new Subject<Round>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getRounds(golferId?: number, year?: number): void {
    let queryParams: string = `?`;
    if (golferId) {
      queryParams += `golfer_id=${golferId}&`;
    }
    if (year) {
      queryParams += `year=${year}&`;
    }
    this.http.get<RoundData[]>(environment.apiUrl + 'rounds/' + queryParams).subscribe((result) => {
      this.roundsData = result;
      this.roundsDataUpdated.next(result);
    });
  }

  getRoundUpdateListener(): Observable<RoundData[]> {
    return this.roundsDataUpdated.asObservable();
  }

  getRound(id: number): void {
    this.http.get<Round>(environment.apiUrl + 'rounds/' + id).subscribe((roundData) => {
      this.selectedRound = roundData;
      this.selectedRoundUpdated.next(roundData);
    });
  }

  getSelectedRoundUpdateListener(): Observable<Round> {
    return this.selectedRoundUpdated.asObservable();
  }
}
