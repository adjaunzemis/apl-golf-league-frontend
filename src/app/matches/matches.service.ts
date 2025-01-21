import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { environment } from './../../environments/environment';
import { MatchData, MatchInput } from '../shared/match.model';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  private matchesData: MatchData[] = [];
  private matchesDataUpdated = new Subject<{ numMatches: number; matches: MatchData[] }>();

  private matchData: MatchData;
  private matchDataUpdated = new Subject<MatchData>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getMatches(offset: number, limit: number, teamId?: number): void {
    let queryParams: string = `?`;
    if (teamId) {
      queryParams = `?team_id=${teamId}&`;
    }
    queryParams += `offset=${offset}&limit=${limit}`;
    this.http
      .get<{
        num_matches: number;
        matches: MatchData[];
      }>(environment.apiUrl + 'matches/' + queryParams)
      .subscribe((result) => {
        this.matchesData = result.matches;
        this.matchesDataUpdated.next({
          numMatches: result.num_matches,
          matches: [...this.matchesData],
        });
      });
  }

  getMatchesUpdateListener(): Observable<{ matches: MatchData[]; numMatches: number }> {
    return this.matchesDataUpdated.asObservable();
  }

  getMatch(id: number): void {
    this.http.get<MatchData>(environment.apiUrl + `matches/${id}`).subscribe((result) => {
      this.matchData = result;
      this.matchDataUpdated.next(this.matchData);
    });
  }

  getMatchUpdateListener(): Observable<MatchData> {
    return this.matchDataUpdated.asObservable();
  }

  postMatchRounds(matchInput: MatchInput): Observable<MatchData> {
    return this.http.post<MatchData>(environment.apiUrl + 'matches/rounds', matchInput);
  }
}
