import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TagModule } from 'primeng/tag';

import { MatchesService } from '../matches.service';
import { CoursesService } from '../../courses/courses.service';
import { GolfersService } from '../../golfers/golfers.service';
import { NotificationService } from '../../notifications/notification.service';

import { Course } from '../../shared/course.model';
import { Golfer } from '../../shared/golfer.model';
import { Track } from '../../shared/track.model';
import { Tee } from '../../shared/tee.model';
import {
  MatchValidationRequest,
  MatchValidationResponse,
  MatchHoleWinner,
} from '../../shared/match.model';
import { RoundValidationRequest } from '../../shared/round.model';
import { HoleResultValidationRequest } from '../../shared/hole-result.model';

@Component({
  selector: 'app-match-scorecard-entry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    SelectModule,
    ButtonModule,
    InputNumberModule,
    DatePickerModule,
    InputTextModule,
    MessageModule,
    FloatLabelModule,
    TagModule,
  ],
  templateUrl: './match-scorecard-entry.component.html',
  styleUrl: './match-scorecard-entry.component.css',
})
export class MatchScorecardEntryComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private matchesService = inject(MatchesService);
  private coursesService = inject(CoursesService);
  private golfersService = inject(GolfersService);
  private notificationService = inject(NotificationService);

  matchForm: FormGroup;
  courses: Course[] = [];
  golfers: Golfer[] = [];
  tracks: Track[] = [];
  homeTees: Tee[] = [];
  awayTees: Tee[] = [];

  validationResponse: MatchValidationResponse | null = null;
  isValidating = false;
  MatchHoleWinner = MatchHoleWinner;

  private subs: Subscription = new Subscription();

  constructor() {
    this.matchForm = this.fb.group({
      date_played: [new Date(), Validators.required],
      course: [null, Validators.required],
      track: [null, Validators.required],
      home_rounds: this.fb.array([]),
      away_rounds: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // Initialize with one golfer each
    this.addHomeGolfer();
    this.addAwayGolfer();

    // Load Courses
    this.subs.add(
      this.coursesService.getCoursesUpdateListener().subscribe((data) => {
        this.courses = data.courses;
      }),
    );
    this.coursesService.getCourses();

    // Load Golfers
    this.subs.add(
      this.golfersService.getAllGolfersUpdateListener().subscribe((golfers) => {
        this.golfers = golfers;
      }),
    );
    this.golfersService.getAllGolfers();

    // Listen for Course Details
    this.subs.add(
      this.coursesService.getSelectedCourseUpdateListener().subscribe((course: Course) => {
        this.tracks = course?.tracks ?? [];
        if (this.tracks.length === 1) {
          this.matchForm.get('track')?.setValue(this.tracks[0]);
        }
        this.isValidating = false;
      }),
    );

    // Handle Course Selection
    this.subs.add(
      this.matchForm.get('course')?.valueChanges.subscribe((course: Course) => {
        if (course) {
          this.isValidating = true;
          this.coursesService.getCourse(course.id);
        } else {
          this.tracks = [];
        }
        this.matchForm.get('track')?.setValue(null);
      }),
    );

    // Handle Track Selection
    this.subs.add(
      this.matchForm.get('track')?.valueChanges.subscribe((track: Track) => {
        const tees = (track?.tees ?? []).map((tee) => ({
          ...tee,
          display_name: `${tee.name} (${tee.gender.charAt(0).toUpperCase()})`,
        }));
        this.homeTees = tees;
        this.awayTees = tees;

        // Reset all tees when track changes
        this.homeRounds.controls.forEach((c) => c.get('tee')?.setValue(null));
        this.awayRounds.controls.forEach((c) => c.get('tee')?.setValue(null));
      }),
    );

    // Auto-validate on changes
    this.subs.add(
      this.matchForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
        if (this.matchForm.valid) {
          this.validateMatch();
        } else {
          this.validationResponse = null;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get homeRounds(): FormArray {
    return this.matchForm.get('home_rounds') as FormArray;
  }

  get awayRounds(): FormArray {
    return this.matchForm.get('away_rounds') as FormArray;
  }

  createRoundGroup(): FormGroup {
    const holes: FormGroup[] = [];
    for (let i = 0; i < 9; i++) {
      holes.push(
        this.fb.group({
          gross_score: [null, [Validators.required, Validators.min(1)]],
        }),
      );
    }

    return this.fb.group({
      golfer: [null, Validators.required],
      tee: [null, Validators.required],
      holes: this.fb.array(holes),
    });
  }

  addHomeGolfer(): void {
    this.homeRounds.push(this.createRoundGroup());
  }

  removeHomeGolfer(index: number): void {
    if (this.homeRounds.length > 1) {
      this.homeRounds.removeAt(index);
    }
  }

  addAwayGolfer(): void {
    this.awayRounds.push(this.createRoundGroup());
  }

  removeAwayGolfer(index: number): void {
    if (this.awayRounds.length > 1) {
      this.awayRounds.removeAt(index);
    }
  }

  getHolesControls(roundGroup: any): FormGroup[] {
    return (roundGroup.get('holes') as FormArray).controls as FormGroup[];
  }

  getHandicapIndex(roundGroup: any): number | null {
    return roundGroup.get('golfer')?.value?.handicap_index ?? null;
  }

  getTee(roundGroup: any): Tee | null {
    return roundGroup?.get('tee')?.value ?? null;
  }

  getPlayingHandicap(roundGroup: any): number | null {
    const golfer = roundGroup.get('golfer')?.value;
    const tee = roundGroup.get('tee')?.value;
    if (golfer && tee) {
      return this.calculateCourseHandicap(golfer, tee);
    }
    return null;
  }

  getTotalPar(tee: Tee | null): number {
    return tee?.holes.reduce((sum, h) => sum + h.par, 0) ?? 0;
  }

  validateMatch(): void {
    if (this.matchForm.invalid) return;

    this.isValidating = true;
    const formValue = this.matchForm.value;

    const homeRounds: RoundValidationRequest[] = formValue.home_rounds.map((round: any) => ({
      date_played: formValue.date_played,
      course_handicap: this.calculateCourseHandicap(round.golfer, round.tee),
      holes: round.holes.map((h: any, i: number) => ({
        number: round.tee.holes[i].number,
        par: round.tee.holes[i].par,
        stroke_index: round.tee.holes[i].stroke_index,
        gross_score: h.gross_score,
      })),
    }));

    const awayRounds: RoundValidationRequest[] = formValue.away_rounds.map((round: any) => ({
      date_played: formValue.date_played,
      course_handicap: this.calculateCourseHandicap(round.golfer, round.tee),
      holes: round.holes.map((h: any, i: number) => ({
        number: round.tee.holes[i].number,
        par: round.tee.holes[i].par,
        stroke_index: round.tee.holes[i].stroke_index,
        gross_score: h.gross_score,
      })),
    }));

    const request: MatchValidationRequest = {
      home_team_rounds: homeRounds,
      away_team_rounds: awayRounds,
    };

    this.matchesService.validateMatch(request).subscribe({
      next: (response) => {
        this.validationResponse = response;
        this.isValidating = false;
        if (!response.is_valid) {
          this.notificationService.showError(
            'Validation Error',
            'Some scores are invalid (e.g. exceed max score).',
          );
        }
      },
      error: (err) => {
        this.isValidating = false;
        console.error(`Failed to validate match: ${err}`);
        this.notificationService.showError('Error', 'Failed to validate match.');
      },
    });
  }

  private calculateCourseHandicap(golfer: Golfer, tee: Tee): number {
    if (golfer.handicap_index === null || golfer.handicap_index === undefined) return 0;
    // Formula: (index / 2) * (slope / 113) + (rating - par)
    // We halve the index because this is a 9-hole scorecard.
    const index = golfer.handicap_index / 2;
    const par = tee.holes.reduce((sum, h) => sum + h.par, 0);
    return Math.round(index * (tee.slope / 113) + (tee.rating - par));
  }

  onSubmit(): void {
    this.notificationService.showSuccess('Success', 'Scorecard is ready for submission!');
    // Submission logic will go here in the future
  }

  getHoleWinnerLabel(winner: MatchHoleWinner): string {
    switch (winner) {
      case MatchHoleWinner.HOME:
        return 'Home';
      case MatchHoleWinner.AWAY:
        return 'Away';
      case MatchHoleWinner.TIE:
        return 'Tie';
      default:
        return '';
    }
  }

  getWinnerSeverity(
    winner: MatchHoleWinner,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (winner) {
      case MatchHoleWinner.HOME:
        return 'success';
      case MatchHoleWinner.AWAY:
        return 'danger';
      case MatchHoleWinner.TIE:
        return 'secondary';
      default:
        return 'secondary';
    }
  }
}
