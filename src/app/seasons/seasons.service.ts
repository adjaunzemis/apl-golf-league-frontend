import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Season } from './../shared/season.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private http = inject(HttpClient);

  private seasons: Season[] | null = null;
  private activeSeason: Season | null = null;

  getSeasons(): Observable<Season[]> {
    if (this.seasons) {
      return of(this.seasons);
    }

    return this.http.get<Season[]>(environment.apiUrl + 'seasons/').pipe(
      tap((result) => {
        console.log(`[SeasonsService] Fetched list of ${result.length} seasons`);
        this.seasons = result;
      }),
    );
  }

  getSeason(year: number): Observable<Season> {
    return this.http.get<Season>(environment.apiUrl + `seasons/${year}`);
  }

  getActiveSeason(): Observable<Season> {
    if (this.activeSeason) {
      return of(this.activeSeason);
    }

    return this.http.get<Season>(environment.apiUrl + 'seasons/active/').pipe(
      tap((result) => {
        console.log(`[SeasonsService] Setting active season: year=${result.year}`);
        this.activeSeason = result;
      }),
    );
  }
}
