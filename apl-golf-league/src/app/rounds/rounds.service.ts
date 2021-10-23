import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { Round } from "../shared/round.model";
import { HoleResult } from "../shared/hole-result.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class RoundsService {
  private rounds: { date: Date, course: string, tee: string, golfer: string, strokes: number }[] = [];
  private roundsUpdated = new Subject<{ rounds: { date: Date, course: string, tee: string, golfer: string, strokes: number }[] }>();

  private selectedRound: Round;
  private selectedRoundUpdated = new Subject<Round>();

  constructor(private http: HttpClient, private router: Router) {}

  getRounds(): void {
    this.http.get<Round[]>(environment.apiUrl + "rounds/details/")
      .subscribe(roundsData => {
        this.rounds = [];
        roundsData.forEach((roundData) => {
          this.rounds.push({ date: roundData.date_played, course: "TODO", tee: roundData.tee.name, golfer: roundData.golfer.name, strokes: roundData.hole_results ? this.computeTotalStrokes(roundData.hole_results) : 0 })
        });
        this.roundsUpdated.next({
          rounds: [...this.rounds]
        });
      });
  }

  getRoundUpdateListener(): Observable<{ rounds: { date: Date, course: string, tee: string, golfer: string, strokes: number }[] }> {
    return this.roundsUpdated.asObservable();
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

