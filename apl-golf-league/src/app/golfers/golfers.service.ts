import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { GolferData } from "../shared/golfer.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class GolfersService {
  private golfersData: GolferData[] = []
  private golfersDataUpdated = new Subject<{ numGolfers: number, golfers: GolferData[] }>();

  constructor(private http: HttpClient, private router: Router) {}

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

  getGolferUpdateListener(): Observable<{ golfers: GolferData[], numGolfers: number }> {
    return this.golfersDataUpdated.asObservable();
  }

}

