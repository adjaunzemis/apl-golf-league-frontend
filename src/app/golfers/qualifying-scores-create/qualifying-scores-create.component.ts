import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageModule } from 'primeng/message';

import { GolfersService } from '../golfers.service';
import { Golfer } from '../../shared/golfer.model';
import { QualifyingScore, QualifyingScoreType } from '../../shared/qualifying-score.model';
import { NotificationService } from '../../notifications/notification.service';

@Component({
  selector: 'app-qualifying-scores-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    SelectModule,
    ButtonModule,
    InputNumberModule,
    InputGroupModule,
    InputGroupAddonModule,
    MessageModule,
  ],
  templateUrl: './qualifying-scores-create.component.html',
  styleUrl: './qualifying-scores-create.component.css',
})
export class QualifyingScoresCreateComponent implements OnInit, OnDestroy {
  private golfersService = inject(GolfersService);
  private notificationService = inject(NotificationService);

  QualifyingScoreType = QualifyingScoreType;

  golferOptions: Golfer[] = [];
  selectedGolfer: Golfer | null = null;
  private golfersSub: Subscription;

  qualifyingScoreType: QualifyingScoreType = QualifyingScoreType.OFFICIAL_HANDICAP_INDEX;
  qualifyingScoreTypeOptions = [
    { label: 'Official Handicap Index', value: QualifyingScoreType.OFFICIAL_HANDICAP_INDEX },
    { label: 'Qualifying Round', value: QualifyingScoreType.QUALIFYING_ROUND },
  ];

  officialHandicapIndex: number | null = null;

  ngOnInit(): void {
    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((golfers) => {
      this.golferOptions = golfers;
    });
    this.golfersService.getAllGolfers();
  }

  ngOnDestroy(): void {
    if (this.golfersSub) {
      this.golfersSub.unsubscribe();
    }
  }

  get hasHandicap(): boolean {
    return this.selectedGolfer?.handicap_index !== undefined && this.selectedGolfer?.handicap_index !== null;
  }

  onSubmit(): void {
    if (!this.selectedGolfer) return;

    if (this.qualifyingScoreType === QualifyingScoreType.OFFICIAL_HANDICAP_INDEX) {
      if (this.officialHandicapIndex === null) return;

      const halfValue = this.officialHandicapIndex / 2;
      const now = new Date();
      const year = now.getFullYear();

      const score1: QualifyingScore = {
        golfer_id: this.selectedGolfer.id,
        year: year,
        type: QualifyingScoreType.OFFICIAL_HANDICAP_INDEX,
        score_differential: halfValue,
        date_updated: now,
      };

      const score2: QualifyingScore = { ...score1 };

      this.golfersService.postQualifyingScore(score1).subscribe({
        next: () => {
          this.golfersService.postQualifyingScore(score2).subscribe({
            next: () => {
              this.notificationService.showSuccess(
                'Success',
                `Successfully added qualifying scores for ${this.selectedGolfer?.name}`,
              );
              this.clearForm();
              this.golfersService.getAllGolfers(); // Refresh to update handicap index
            },
            error: () => {
              this.notificationService.showError('Error', 'Failed to add second qualifying score');
            },
          });
        },
        error: () => {
          this.notificationService.showError('Error', 'Failed to add first qualifying score');
        },
      });
    }
  }

  clearForm(): void {
    this.selectedGolfer = null;
    this.officialHandicapIndex = null;
    this.qualifyingScoreType = QualifyingScoreType.OFFICIAL_HANDICAP_INDEX;
  }
}
