import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Season } from './../shared/season.model';
import { environment } from './../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private activeSeason: Season | null = null;

  constructor(private http: HttpClient) {}

  getActiveSeason(): Observable<Season> {
    if (this.activeSeason) {
      return of(this.activeSeason);
    }

    return this.http
      .get<Season>(environment.apiUrl + 'seasons/active/')
      .pipe(tap((result) => (this.activeSeason = result)));
  }
}
