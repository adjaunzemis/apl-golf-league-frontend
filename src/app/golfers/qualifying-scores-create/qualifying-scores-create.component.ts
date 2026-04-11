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
import { TabsModule } from 'primeng/tabs';

import { GolfersService } from '../golfers.service';
import { Golfer } from '../../shared/golfer.model';
import { QualifyingScore, QualifyingScoreType } from '../../shared/qualifying-score.model';
import { NotificationService } from '../../notifications/notification.service';
import { QualifyingRoundEntryComponent, RoundEntryData } from './qualifying-round-entry/qualifying-round-entry.component';

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
    TabsModule,
    QualifyingRoundEntryComponent,
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

  // Qualifying Round Data
  round1Data: RoundEntryData | null = null;
  round1Valid = false;
  round2Data: RoundEntryData | null = null;
  round2Valid = false;

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

  onRound1StatusChange(event: { isValid: boolean; data: RoundEntryData | null }): void {
    this.round1Valid = event.isValid;
    this.round1Data = event.data;
  }

  onRound2StatusChange(event: { isValid: boolean; data: RoundEntryData | null }): void {
    this.round2Valid = event.isValid;
    this.round2Data = event.data;
  }

  get isQualifyingRoundValid(): boolean {
    return this.round1Valid && this.round2Valid;
  }

  onSubmit(): void {
    if (!this.selectedGolfer) return;

    if (this.qualifyingScoreType === QualifyingScoreType.OFFICIAL_HANDICAP_INDEX) {
      this.submitOfficialHandicapIndex();
    } else if (this.qualifyingScoreType === QualifyingScoreType.QUALIFYING_ROUND) {
      this.submitQualifyingRounds();
    }
  }

  private submitOfficialHandicapIndex(): void {
    if (this.officialHandicapIndex === null || !this.selectedGolfer) return;

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

    this.postTwoScores(score1, score2);
  }

  private submitQualifyingRounds(): void {
    if (!this.isQualifyingRoundValid || !this.selectedGolfer || !this.round1Data || !this.round2Data) return;

    const now = new Date();
    const year = now.getFullYear();

    const score1: QualifyingScore = {
      golfer_id: this.selectedGolfer.id,
      year: year,
      type: QualifyingScoreType.QUALIFYING_ROUND,
      score_differential: 0.0, // Placeholder
      date_updated: now,
      date_played: this.round1Data.date_played,
      course_name: this.round1Data.course_name,
      track_name: this.round1Data.track_name,
      tee_name: this.round1Data.tee_name,
      tee_par: this.round1Data.total_par,
      tee_rating: this.round1Data.tee_rating,
      tee_slope: this.round1Data.tee_slope,
      gross_score: this.round1Data.total_score,
      adjusted_gross_score: 0.0, // Placeholder
      comment: this.round1Data.comment as any,
    };

    const score2: QualifyingScore = {
      golfer_id: this.selectedGolfer.id,
      year: year,
      type: QualifyingScoreType.QUALIFYING_ROUND,
      score_differential: 0.0, // Placeholder
      date_updated: now,
      date_played: this.round2Data.date_played,
      course_name: this.round2Data.course_name,
      track_name: this.round2Data.track_name,
      tee_name: this.round2Data.tee_name,
      tee_par: this.round2Data.total_par,
      tee_rating: this.round2Data.tee_rating,
      tee_slope: this.round2Data.tee_slope,
      gross_score: this.round2Data.total_score,
      adjusted_gross_score: 0.0, // Placeholder
      comment: this.round2Data.comment as any,
    };

    this.postTwoScores(score1, score2);
  }

  private postTwoScores(score1: QualifyingScore, score2: QualifyingScore): void {
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

  clearForm(): void {
    this.selectedGolfer = null;
    this.officialHandicapIndex = null;
    this.qualifyingScoreType = QualifyingScoreType.OFFICIAL_HANDICAP_INDEX;
    this.round1Data = null;
    this.round1Valid = false;
    this.round2Data = null;
    this.round2Valid = false;
  }
}
