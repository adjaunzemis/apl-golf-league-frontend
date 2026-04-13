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
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';

import { GolfersService } from '../golfers.service';
import { Golfer } from '../../shared/golfer.model';
import { QualifyingScore, QualifyingScoreType } from '../../shared/qualifying-score.model';
import { NotificationService } from '../../notifications/notification.service';
import {
  QualifyingRoundEntryComponent,
  RoundEntryData,
} from './qualifying-round-entry/qualifying-round-entry.component';

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
    DatePickerModule,
    InputTextModule,
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
  officialDatePlayed: Date | null = new Date();
  officialComment = '';

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
    return (
      this.selectedGolfer?.handicap_index !== undefined &&
      this.selectedGolfer?.handicap_index !== null
    );
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
    return (
      this.round1Valid &&
      this.round2Valid &&
      this.round1Data?.score_differential !== null &&
      this.round2Data?.score_differential !== null
    );
  }

  onSubmit(): void {
    if (!this.selectedGolfer) return;

    if (this.qualifyingScoreType === QualifyingScoreType.OFFICIAL_HANDICAP_INDEX) {
      this.submitOfficialHandicapIndex();
    } else if (this.qualifyingScoreType === QualifyingScoreType.QUALIFYING_ROUND) {
      this.submitQualifyingRounds();
    }
  }

  private toMidnightET(date: Date): Date {
    try {
      if (!date || isNaN(date.getTime())) {
        date = new Date();
      }

      // 1. Get the calendar date parts from the input date
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // 2. Create a Date object representing midnight UTC for that calendar day
      const utcMidnight = new Date(Date.UTC(year, month, day));

      // 3. Determine the hour offset of America/New_York at that specific moment
      // We use Intl.DateTimeFormat with hour12: false to get a 0-23 hour value
      const etHourStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: false,
      }).format(utcMidnight);

      const etHour = parseInt(etHourStr, 10);

      // 4. Calculate the difference.
      // If etHour is 20 (8 PM day before), diff is -4.
      // If etHour is 19 (7 PM day before), diff is -5.
      const diff = etHour > 12 ? etHour - 24 : etHour;

      // 5. Midnight ET = UTC Midnight - diff hours
      // e.g., if offset is -4, Midnight ET is UTC Midnight + 4 hours (04:00 UTC)
      const result = new Date(utcMidnight.getTime() - diff * 60 * 60 * 1000);

      if (isNaN(result.getTime())) {
        throw new Error('Invalid date calculation');
      }

      return result;
    } catch {
      // Fallback to UTC midnight if anything goes wrong, to ensure we don't send NULL
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
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
      comment: this.officialComment,
    };

    // Explicitly use officialDatePlayed if it exists, otherwise use 'now' but to midnight ET
    const dateToUse = this.officialDatePlayed || now;
    score1.date_played = this.toMidnightET(dateToUse);

    const score2: QualifyingScore = { ...score1 };

    this.postTwoScores(score1, score2);
  }

  private submitQualifyingRounds(): void {
    if (
      !this.isQualifyingRoundValid ||
      !this.selectedGolfer ||
      !this.round1Data ||
      !this.round2Data
    )
      return;

    const now = new Date();
    const year = now.getFullYear();

    const score1: QualifyingScore = {
      golfer_id: this.selectedGolfer.id,
      year: year,
      type: QualifyingScoreType.QUALIFYING_ROUND,
      score_differential: this.round1Data.score_differential!,
      date_updated: now,
      date_played: this.toMidnightET(this.round1Data.date_played),
      course_name: this.round1Data.course_name,
      track_name: this.round1Data.track_name,
      tee_name: this.round1Data.tee_name,
      tee_gender: this.round1Data.tee_gender,
      tee_par: this.round1Data.total_par,
      tee_rating: this.round1Data.tee_rating,
      tee_slope: this.round1Data.tee_slope,
      gross_score: this.round1Data.total_score,
      adjusted_gross_score: this.round1Data.total_adjusted_score,
      comment: this.round1Data.comment,
    };

    const score2: QualifyingScore = {
      golfer_id: this.selectedGolfer.id,
      year: year,
      type: QualifyingScoreType.QUALIFYING_ROUND,
      score_differential: this.round2Data.score_differential!,
      date_updated: now,
      date_played: this.toMidnightET(this.round2Data.date_played),
      course_name: this.round2Data.course_name,
      track_name: this.round2Data.track_name,
      tee_name: this.round2Data.tee_name,
      tee_gender: this.round2Data.tee_gender,
      tee_par: this.round2Data.total_par,
      tee_rating: this.round2Data.tee_rating,
      tee_slope: this.round2Data.tee_slope,
      gross_score: this.round2Data.total_score,
      adjusted_gross_score: this.round2Data.total_adjusted_score,
      comment: this.round2Data.comment,
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
    this.officialDatePlayed = new Date();
    this.officialComment = '';
    this.qualifyingScoreType = QualifyingScoreType.OFFICIAL_HANDICAP_INDEX;
    this.round1Data = null;
    this.round1Valid = false;
    this.round2Data = null;
    this.round2Valid = false;
  }
}
