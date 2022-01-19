import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GolferData } from 'src/app/shared/golfer.model';

import { GolfersService } from '../golfers.service';

@Component({
  selector: 'app-golfer-home',
  templateUrl: './golfer-home.component.html',
  styleUrls: ['./golfer-home.component.css']
})
export class GolferHomeComponent implements OnInit, OnDestroy {
  isLoading = false;

  golferId: number;
  
  golfer: GolferData;
  golferSub: Subscription;

  constructor(private golfersService: GolfersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;

    // this.golferSub = this.golfersService.getGolferUpdateListener()
    //   .subscribe((result: GolferData) => {
    //     console.log(`[GolferHomeComponent] Received golfer data`);
    //     this.isLoading = false;
    //     this.golfer = result;
    //   });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.id) {
          console.log("[GolferHomeComponent] Setting query parameter id=" + params.id);
          this.golferId = params.id;
        }
      }
    });

    this.getGolferData();
  }

  ngOnDestroy(): void {
    this.golferSub.unsubscribe();
  }

  getGolferData(): void {
    console.log("[GolferHomeComponent] Fetching golfer data");
  }

}
