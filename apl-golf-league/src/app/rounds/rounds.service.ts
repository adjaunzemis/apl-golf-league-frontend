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
  private roundSummariesUpdated = new Subject<{rounds: RoundSummary[]}>();

  private selectedRound: Round;
  private selectedRoundUpdated = new Subject<Round>();

  constructor(private http: HttpClient, private router: Router) {}

  getRounds(): void {
    this.http.get<RoundSummary[]>(environment.apiUrl + "rounds/")
      .subscribe(roundsData => {
        this.roundSummaries = roundsData;
        this.roundSummariesUpdated.next({
          rounds: [...this.roundSummaries]
        });
      });
  }

  getRoundUpdateListener(): Observable<{ rounds: RoundSummary[] }> {
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

