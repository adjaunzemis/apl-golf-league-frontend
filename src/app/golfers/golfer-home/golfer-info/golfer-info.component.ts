import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { GolferData } from 'src/app/shared/golfer.model';
import { SelectModule } from 'primeng/select';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { Season } from 'src/app/shared/season.model';

@Component({
  selector: 'app-golfer-info',
  templateUrl: './golfer-info.component.html',
  styleUrl: './golfer-info.component.css',
  imports: [CommonModule, FormsModule, CardModule, SelectModule, TagModule],
})
export class GolferInfoComponent implements OnInit, OnDestroy {
  @Input() golfer: GolferData;

  private seasonsSub: Subscription;
  seasons: Season[];
  selectedSeason: Season;

  private seasonsService = inject(SeasonsService);

  ngOnInit(): void {
    this.seasonsSub = this.seasonsService.getSeasons().subscribe((result) => {
      this.seasons = [...result];
      this.selectedSeason = result.filter((season) => season.is_active)[0];
    });
  }

  ngOnDestroy(): void {
    this.seasonsSub.unsubscribe();
  }
}
