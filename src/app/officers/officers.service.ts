import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import { Officer } from './../shared/officer.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OfficersService {
  private http = inject(HttpClient);

  private officersList: Officer[] = [];
  private officersListUpdated = new Subject<Officer[]>();

  getOfficersList(year?: number): void {
    let queryParams = ``;
    if (year) {
      queryParams = `?year=${year}`;
    }
    this.http.get<Officer[]>(environment.apiUrl + 'officers/' + queryParams).subscribe((result) => {
      this.officersList = result;
      this.officersListUpdated.next([...this.officersList]);
    });
  }

  getOfficersListObservable(year?: number): Observable<Officer[]> {
    let queryParams = ``;
    if (year) {
      queryParams = `?year=${year}`;
    }
    return this.http.get<Officer[]>(environment.apiUrl + 'officers/' + queryParams);
  }

  createOfficer(officer: Officer): Observable<Officer> {
    return this.http.post<Officer>(environment.apiUrl + 'officers/', officer).pipe(
      tap(() => {
        this.getOfficersList(officer.year);
      }),
    );
  }

  updateOfficer(officerId: number, officer: Partial<Officer>): Observable<Officer> {
    return this.http.patch<Officer>(environment.apiUrl + `officers/${officerId}`, officer).pipe(
      tap((updated) => {
        this.getOfficersList(updated.year);
      }),
    );
  }

  getOfficersListUpdateListener(): Observable<Officer[]> {
    return this.officersListUpdated.asObservable();
  }
}
