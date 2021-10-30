import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { Round, RoundSummary } from "../shared/round.model";
import { HoleResult } from "../shared/hole-result.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class RoundsService {
  private roundSummaries: RoundSummary[] = []
  private roundSummariesUpdated = new Subject<{ totalRounds: number, rounds: RoundSummary[] }>();

  private selectedRound: Round;
  private selectedRoundUpdated = new Subject<Round>();

  constructor(private http: HttpClient, private router: Router) {}

  getRounds(offset: number, limit: number): void {
    const queryParams = `?offset=${offset}&limit=${limit}`
    this.http.get<{ totalRounds: number, rounds: RoundSummary[] }>(environment.apiUrl + "rounds/" + queryParams)
      .subscribe(roundsData => {
        this.roundSummaries = roundsData.rounds;
        this.roundSummariesUpdated.next({
          totalRounds: roundsData.totalRounds,
          rounds: [...this.roundSummaries]
        });
      });
  }

  getRoundUpdateListener(): Observable<{ rounds: RoundSummary[], totalRounds: number }> {
    return this.roundSummariesUpdated.asObservable();
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

  computeTotalStrokes(holeResults: HoleResult[]): number {
    let strokes = 0;
    holeResults.forEach((holeResult) => {
      strokes += holeResult.strokes;
    })
    return strokes;
  }

}

