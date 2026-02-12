import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { APIService } from 'src/app/api/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false,
})
export class FooterComponent implements OnInit, OnDestroy {
  private apiService = inject(APIService);

  websiteVersion: string = environment.version;
  apiVersion = '--';

  private apiInfoSub: Subscription;

  ngOnInit(): void {
    if (environment.maintenance) {
      return;
    }

    this.apiInfoSub = this.apiService.getInfoUpdateListener().subscribe((result) => {
      console.log(`[FooterComponent] Received API info`);
      this.apiVersion = result.version;
    });
    this.apiService.getInfo();
  }

  ngOnDestroy(): void {
    this.apiInfoSub.unsubscribe();
  }
}
