import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { Golfer, GolferAffiliation, GolferData, GolferStatistics, TeamGolferData } from '../shared/golfer.model';
import { QualifyingScore } from '../shared/qualifying-score.model';
import { environment } from './../../environments/environment';
import { ScoringRecordRound } from '../shared/handicap.model';

@Injectable({
  providedIn: 'root',
})
export class GolfersService {
  private allGolfers: Golfer[] = [];
  private allGolfersUpdated = new Subject<Golfer[]>();

  private golfersData: GolferData[] = [];
  private golfersDataUpdated = new Subject<{ numGolfers: number; golfers: GolferData[] }>();

  private golferData: GolferData;
  private golferDataUpdated = new Subject<GolferData>();

  private golferTeamData: TeamGolferData[] = [];
  private golferTeamDataUpdated = new Subject<TeamGolferData[]>();

  private golferHandicapScoringRecord: ScoringRecordRound[];
  private golferHandicapScoringRecordUpdated = new Subject<ScoringRecordRound[]>();
  
  private golferStatistics: GolferStatistics;
  private golferStatisticsUpdated = new Subject<GolferStatistics>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getAllGolfers(): void {
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
      queryParams = `?year=${year}&`;
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
    let params = `${id}`;
    if (max_date) {
      params += `?max_date=${max_date.toISOString().split('T')[0]}`;
    }
    this.http.get<GolferData>(environment.apiUrl + `golfers/` + params).subscribe((result) => {
      this.golferData = result;
      this.golferDataUpdated.next(this.golferData);
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
    this.http
      .get<TeamGolferData[]>(environment.apiUrl + `golfers/${id}/teams?year=${year}`)
      .subscribe((result) => {
        this.golferTeamData = result;
        this.golferTeamDataUpdated.next([...this.golferTeamData]);
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
    this.http
      .get<
        ScoringRecordRound[]
      >(environment.apiUrl + `handicaps/scoring-record-rounds/${golferId}?year=${year}`)
      .subscribe((result) => {
        this.golferHandicapScoringRecord = [...result];
        this.golferHandicapScoringRecordUpdated.next([...this.golferHandicapScoringRecord]);
      });
  }

  getGolferHandicapScoringRecordUpdateListener(): Observable<ScoringRecordRound[]> {
    return this.golferHandicapScoringRecordUpdated.asObservable();
  }

  getGolferStatistics(golferId: number, year?: number): void {
    let queryUrl = environment.apiUrl + `golfers/${golferId}/statistics`;
    if (year !== undefined) {
      queryUrl += `?year=${year}`;
    }
    this.http.get<GolferStatistics>(queryUrl).subscribe((result) => {
      this.golferStatistics = result;
      this.golferStatisticsUpdated.next(this.golferStatistics);
    })
  }

  getGolferStatisticsUpdateListener(): Observable<GolferStatistics> {
    return this.golferStatisticsUpdated.asObservable();
  }
}
