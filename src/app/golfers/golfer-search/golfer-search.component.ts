import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { GolfersService } from '../golfers.service';
import { Golfer, GolferAffiliation } from '../../shared/golfer.model';

@Component({
  selector: 'app-golfer-search',
  templateUrl: './golfer-search.component.html',
  styleUrls: ['./golfer-search.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    InputTextModule,
    MultiSelectModule,
    IconFieldModule,
    InputIconModule,
  ],
})
export class GolferSearchComponent implements OnInit, OnDestroy {
  isLoading = true;

  golfers!: Golfer[];
  private golfersSub: Subscription;

  affiliations!: GolferAffiliation[];

  private golfersService = inject(GolfersService);

  ngOnInit(): void {
    this.affiliations = [
      GolferAffiliation.APL_EMPLOYEE,
      GolferAffiliation.APL_RETIREE,
      GolferAffiliation.APL_FAMILY,
      GolferAffiliation.NON_APL_EMPLOYEE,
    ];

    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((result) => {
      this.golfers = [...result];
      this.isLoading = false;
    });

    this.golfersService.getAllGolfers();
  }

  ngOnDestroy(): void {
    this.golfersSub.unsubscribe();
  }

  getAffiliationColor(affiliation: GolferAffiliation) {
    switch (affiliation) {
      case GolferAffiliation.APL_EMPLOYEE:
        return 'info';
      case GolferAffiliation.APL_RETIREE:
        return 'success';
      case GolferAffiliation.APL_FAMILY:
        return 'warn';
      case GolferAffiliation.NON_APL_EMPLOYEE:
        return 'danger';
    }
  }

  getTarget(target: EventTarget | null): HTMLInputElement {
    return target as HTMLInputElement;
  }
}
