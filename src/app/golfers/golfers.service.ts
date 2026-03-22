import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  Golfer,
  GolferAffiliation,
  GolferData,
  GolferStatistics,
  TeamGolferData,
} from '../shared/golfer.model';
import { QualifyingScore } from '../shared/qualifying-score.model';
import { environment } from './../../environments/environment';
import { ScoringRecordRound } from '../shared/handicap.model';

@Injectable({
  providedIn: 'root',
})
export class GolfersService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private allGolfers: Golfer[] = [];
  private allGolfersUpdated = new Subject<Golfer[]>();

  private golfersData: GolferData[] = [];
  private golfersDataUpdated = new Subject<{ numGolfers: number; golfers: GolferData[] }>();

  // Caching
  private golferDataCache = new Map<string, GolferData>();
  private golferDataUpdated = new Subject<GolferData>();

  private golferTeamDataCache = new Map<string, TeamGolferData[]>();
  private golferTeamDataUpdated = new Subject<TeamGolferData[]>();

  private golferHandicapScoringRecordCache = new Map<string, ScoringRecordRound[]>();
  private golferHandicapScoringRecordUpdated = new Subject<ScoringRecordRound[]>();

  private golferStatisticsCache = new Map<string, GolferStatistics>();
  private golferStatisticsUpdated = new Subject<GolferStatistics>();

  getAllGolfers(): void {
    if (this.allGolfers.length > 0) {
      this.allGolfersUpdated.next([...this.allGolfers]);
      return;
    }
    this.http.get<Golfer[]>(environment.apiUrl + 'golfers/info').subscribe((result) => {
      this.allGolfers = result;
      this.allGolfersUpdated.next([...this.allGolfers]);
    });
  }

  getAllGolfersUpdateListener(): Observable<Golfer[]> {
    return this.allGolfersUpdated.asObservable();
  }

  getGolfers(offset: number, limit: number, year?: number): void {
    let queryParams = `?`;
    if (year) {
      queryParams = `year=${year}&`;
    }
    queryParams += `offset=${offset}&limit=${limit}`;
    this.http
      .get<{
        num_golfers: number;
        golfers: GolferData[];
      }>(environment.apiUrl + 'golfers/' + queryParams)
      .subscribe((result) => {
        this.golfersData = result.golfers;
        this.golfersDataUpdated.next({
          numGolfers: result.num_golfers,
          golfers: [...this.golfersData],
        });
      });
  }

  getGolfersUpdateListener(): Observable<{ golfers: GolferData[]; numGolfers: number }> {
    return this.golfersDataUpdated.asObservable();
  }

  getGolfer(id: number, max_date?: Date): void {
    const dateStr = max_date ? max_date.toISOString().split('T')[0] : 'no-date';
    const cacheKey = `${id}-${dateStr}`;

    if (this.golferDataCache.has(cacheKey)) {
      this.golferDataUpdated.next(this.golferDataCache.get(cacheKey)!);
      return;
    }

    let params = `${id}`;
    if (max_date) {
      params += `?max_date=${max_date.toISOString().split('T')[0]}`;
    }
    this.http.get<GolferData>(environment.apiUrl + `golfers/` + params).subscribe((result) => {
      this.golferDataCache.set(cacheKey, result);
      this.golferDataUpdated.next(result);
    });
  }

  getGolferUpdateListener(): Observable<GolferData> {
    return this.golferDataUpdated.asObservable();
  }

  createGolfer(
    name: string,
    affiliation: GolferAffiliation,
    email: string,
    phone?: string,
  ): Observable<Golfer> {
    return this.http.post<Golfer>(environment.apiUrl + `golfers/`, {
      name: name,
      affiliation: affiliation,
      email: email,
      phone: phone,
    });
  }

  getGolferTeamData(id: number, year: number): void {
    const cacheKey = `${id}-${year}`;
    if (this.golferTeamDataCache.has(cacheKey)) {
      this.golferTeamDataUpdated.next([...this.golferTeamDataCache.get(cacheKey)!]);
      return;
    }

    this.http
      .get<TeamGolferData[]>(environment.apiUrl + `golfers/${id}/teams?year=${year}`)
      .subscribe((result) => {
        this.golferTeamDataCache.set(cacheKey, result);
        this.golferTeamDataUpdated.next([...result]);
      });
  }

  getGolferTeamDataUpdateListener(): Observable<TeamGolferData[]> {
    return this.golferTeamDataUpdated.asObservable();
  }

  postQualifyingScore(qualifyingScore: QualifyingScore): Observable<QualifyingScore> {
    const queryParams = `use_legacy_handicapping=True`; // TODO: change to non-legacy handicapping system when ready
    return this.http.post<QualifyingScore>(
      environment.apiUrl + `handicaps/qualifying-score/?${queryParams}`,
      qualifyingScore,
    );
  }

  getGolferHandicapScoringRecord(golferId: number, year: number): void {
    const cacheKey = `${golferId}-${year}`;
    if (this.golferHandicapScoringRecordCache.has(cacheKey)) {
      this.golferHandicapScoringRecordUpdated.next([
        ...this.golferHandicapScoringRecordCache.get(cacheKey)!,
      ]);
      return;
    }

    this.http
      .get<
        ScoringRecordRound[]
      >(environment.apiUrl + `handicaps/scoring-record-rounds/${golferId}?year=${year}`)
      .subscribe((result) => {
        this.golferHandicapScoringRecordCache.set(cacheKey, result);
        this.golferHandicapScoringRecordUpdated.next([...result]);
      });
  }

  getGolferHandicapScoringRecordUpdateListener(): Observable<ScoringRecordRound[]> {
    return this.golferHandicapScoringRecordUpdated.asObservable();
  }

  getGolferStatistics(golferId: number, year?: number): void {
    const cacheKey = `${golferId}-${year || 'no-year'}`;
    if (this.golferStatisticsCache.has(cacheKey)) {
      this.golferStatisticsUpdated.next(this.golferStatisticsCache.get(cacheKey)!);
      return;
    }

    let queryUrl = environment.apiUrl + `golfers/${golferId}/statistics`;
    if (year !== undefined) {
      queryUrl += `?year=${year}`;
    }
    this.http.get<GolferStatistics>(queryUrl).subscribe((result) => {
      this.golferStatisticsCache.set(cacheKey, result);
      this.golferStatisticsUpdated.next(result);
    });
  }

  getGolferStatisticsUpdateListener(): Observable<GolferStatistics> {
    return this.golferStatisticsUpdated.asObservable();
  }
}
