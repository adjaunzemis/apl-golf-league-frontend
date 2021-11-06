import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { Round, RoundData } from "../shared/round.model";
import { HoleResult } from "../shared/hole-result.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class RoundsService {
  private roundsData: RoundData[] = []
  private roundsDataUpdated = new Subject<{ numRounds: number, rounds: RoundData[] }>();

  private selectedRound: Round;
  private selectedRoundUpdated = new Subject<Round>();

  constructor(private http: HttpClient, private router: Router) {}

  getRounds(offset: number, limit: number, golferId?: number): void {
    let queryParams: string = `?`;
    if (golferId) {
      queryParams = `?golfer_id=${golferId}&`;
    }
    queryParams += `offset=${offset}&limit=${limit}`
    this.http.get<{ num_rounds: number, rounds: RoundData[] }>(environment.apiUrl + "rounds/" + queryParams)
      .subscribe(result => {
        this.roundsData = result.rounds;
        this.roundsDataUpdated.next({
          numRounds: result.num_rounds,
          rounds: [...this.roundsData]
        });
      });
  }

  getRoundUpdateListener(): Observable<{ rounds: RoundData[], numRounds: number }> {
    return this.roundsDataUpdated.asObservable();
  }

  getRound(id: number): void {
    this.http.get<Round>(environment.apiUrl + "rounds/" + id)
      .subscribe(roundData => {
        this.selectedRound = roundData;
        this.selectedRoundUpdated.next(roundData);
      })
  }

  getSelectedRoundUpdateListener(): Observable<Round> {
    return this.selectedRoundUpdated.asObservable();
  }

}

