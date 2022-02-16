import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { Officer } from './../shared/officer.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class OfficersService {
  private officersList: Officer[] = []
  private officersListUpdated = new Subject<Officer[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getOfficersList(offset: number, limit: number, year?: number): void {
    let queryParams: string = `?`;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    queryParams += `offset=${offset}&limit=${limit}`
    this.http.get<Officer[]>(environment.apiUrl + "officers/" + queryParams)
      .subscribe(result => {
        this.officersList = result;
        this.officersListUpdated.next([...this.officersList]);
      });
  }

  getOfficersListUpdateListener(): Observable<Officer[]> {
    return this.officersListUpdated.asObservable();
  }

}

