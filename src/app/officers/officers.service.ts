import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
      queryParams = `?year=${year}&`;
    }
    this.http.get<Officer[]>(environment.apiUrl + 'officers/' + queryParams).subscribe((result) => {
      this.officersList = result;
      this.officersListUpdated.next([...this.officersList]);
    });
  }

  getOfficersListUpdateListener(): Observable<Officer[]> {
    return this.officersListUpdated.asObservable();
  }
}
