import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { Golfer, GolferAffiliation, GolferData, TeamGolferData } from "../shared/golfer.model";
import { QualifyingScore } from "../shared/qualifying-score.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class GolfersService {
  private allGolfers: Golfer[] = [];
  private allGolfersUpdated = new Subject<Golfer[]>();

  private golfersData: GolferData[] = [];
  private golfersDataUpdated = new Subject<{ numGolfers: number, golfers: GolferData[] }>();

  private golferData: GolferData
  private golferDataUpdated = new Subject<GolferData>();

  private golferTeamData: TeamGolferData[] = [];
  private golferTeamDataUpdated = new Subject<TeamGolferData[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getAllGolfers(): void {
    this.http.get<Golfer[]>(environment.apiUrl + "golfers/info")
      .subscribe(result => {
        this.allGolfers = result;
        this.allGolfersUpdated.next([...this.allGolfers]);
      });
  }

  getAllGolfersUpdateListener(): Observable<Golfer[]> {
    return this.allGolfersUpdated.asObservable();
  }

  getGolfers(offset: number, limit: number, year?: number): void {
    let queryParams: string = `?`;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    queryParams += `offset=${offset}&limit=${limit}`
    this.http.get<{ num_golfers: number, golfers: GolferData[] }>(environment.apiUrl + "golfers/" + queryParams)
      .subscribe(result => {
        this.golfersData = result.golfers;
        this.golfersDataUpdated.next({
          numGolfers: result.num_golfers,
          golfers: [...this.golfersData]
        });
      });
  }

  getGolfersUpdateListener(): Observable<{ golfers: GolferData[], numGolfers: number }> {
    return this.golfersDataUpdated.asObservable();
  }

  getGolfer(id: number): void {
    this.http.get<GolferData>(environment.apiUrl + `golfers/${id}`)
      .subscribe(result => {
        this.golferData = result;
        this.golferDataUpdated.next(this.golferData);
      });
  }

  getGolferUpdateListener(): Observable<GolferData> {
    return this.golferDataUpdated.asObservable();
  }

  createGolfer(name: string, affiliation: GolferAffiliation, email?: string, phone?: string): Observable<Golfer> {
    return this.http.post<Golfer>(environment.apiUrl + `golfers/`, { name: name, affiliation: affiliation, email: email, phone: phone });
  }

  getGolferTeamData(id: number, year: number): void {
    this.http.get<TeamGolferData[]>(environment.apiUrl + `golfers/${id}/teams?year=${year}`).subscribe(result => {
      this.golferTeamData = result;
      this.golferTeamDataUpdated.next([...this.golferTeamData]);
    });
  }

  getGolferTeamDataUpdateListener(): Observable<TeamGolferData[]> {
    return this.golferTeamDataUpdated.asObservable();
  }

  postQualifyingScore(qualifyingScore: QualifyingScore): Observable<QualifyingScore> {
    const queryParams = `use_legacy_handicapping=True`; // TODO: change to non-legacy handicapping system when ready
    return this.http.post<QualifyingScore>(environment.apiUrl + `handicaps/qualifying-score/?${queryParams}`, qualifyingScore);
  }

}

