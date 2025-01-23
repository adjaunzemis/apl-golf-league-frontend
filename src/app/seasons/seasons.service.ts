import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Season } from './../shared/season.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private activeSeason: Season;
  private activeSeasonUpdated = new Subject<Season>();

  constructor(private http: HttpClient) {}

  getActiveSeason(): void {
    this.http.get<Season>(environment.apiUrl + 'seasons/active/').subscribe((result) => {
      this.activeSeason = result;
      this.activeSeasonUpdated.next(this.activeSeason);
    });
  }

  getActiveSeasonListener(): Observable<Season> {
    return this.activeSeasonUpdated.asObservable();
  }

}
