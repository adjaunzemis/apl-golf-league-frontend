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
      console.log(`[SeasonsService] Received active season: ${result}`);
      this.activeSeason = result;
      this.activeSeasonUpdated.next(this.activeSeason);
    });
  }

  getActiveSeasonUpdateListener(): Observable<Season> {
    return this.activeSeasonUpdated.asObservable();
  }
}
