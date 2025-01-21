import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { APIInfo } from './../shared/api.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private info: APIInfo;
  private infoUpdated = new Subject<APIInfo>();

  constructor(private http: HttpClient) {}

  getInfo(): void {
    this.http.get<APIInfo>(environment.apiUrl).subscribe((result) => {
      this.info = result;
      this.infoUpdated.next(this.info);
    });
  }

  getInfoUpdateListener(): Observable<APIInfo> {
    return this.infoUpdated.asObservable();
  }
}
