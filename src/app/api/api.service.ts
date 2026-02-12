import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { APIInfo } from './../shared/api.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private http = inject(HttpClient);

  private info: APIInfo;
  private infoUpdated = new Subject<APIInfo>();

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
