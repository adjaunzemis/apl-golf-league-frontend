import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { GolferInfoComponent } from './golfer-info/golfer-info.component';
import { GolfersService } from '../golfers.service';
import { GolferData } from 'src/app/shared/golfer.model';

@Component({
  selector: 'app-golfer-home',
  templateUrl: './golfer-home.component.html',
  styleUrl: './golfer-home.component.css',
  imports: [CommonModule, ProgressSpinnerModule, GolferInfoComponent],
})
export class GolferHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  private golferSub: Subscription;
  golfer: GolferData;

  private golfersService = inject(GolfersService);

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.golferSub = this.golfersService.getGolferUpdateListener().subscribe((result) => {
      this.golfer = result;
      console.log(result);

      this.isLoading = false;
    });

    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        console.log('[GolferHomeComponent] Processing route with query parameter: id=' + params.id);
        const golferId = params.id;

        this.golfersService.getGolfer(golferId);
      }
    });
  }

  ngOnDestroy(): void {
    this.golferSub.unsubscribe();
  }
}
