import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private appConfig: AppConfigInfo;

  constructor(private http: HttpClient) {}

  loadAppConfig(): Promise<void> {
    return this.http
      .get('/assets/config.json')
      .toPromise()
      .then((data) => {
        this.appConfig = data as AppConfigInfo;
      });
  }

  get currentYear(): number {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.currentYear;
  }
}

interface AppConfigInfo {
  currentYear: number;
}
