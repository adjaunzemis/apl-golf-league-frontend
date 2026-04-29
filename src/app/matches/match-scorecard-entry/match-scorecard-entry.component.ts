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
      home_golfer: [null, Validators.required],
      home_tee: [null, Validators.required],
      away_golfer: [null, Validators.required],
      away_tee: [null, Validators.required],
      holes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // Initialize 9 holes
    const holesArray = this.matchForm.get('holes') as FormArray;
    for (let i = 0; i < 9; i++) {
      holesArray.push(
        this.fb.group({
          gross_home: [null, [Validators.required, Validators.min(1)]],
          gross_away: [null, [Validators.required, Validators.min(1)]],
        }),
      );
    }

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

    // Listen for Course Details (Standard Flow)
    this.subs.add(
      this.coursesService.getSelectedCourseUpdateListener().subscribe((course: Course) => {
        this.tracks = course?.tracks ?? [];
        // If there's only one track, select it automatically
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
          this.coursesService.getCourse(course.id); // Triggers subject
        } else {
          this.tracks = [];
        }
        this.matchForm.get('track')?.setValue(null);
      }),
    );

    // Handle Track Selection
    this.subs.add(
      this.matchForm.get('track')?.valueChanges.subscribe((track: Track) => {
        this.homeTees = track?.tees ?? [];
        this.awayTees = track?.tees ?? [];
        this.matchForm.get('home_tee')?.setValue(null);
        this.matchForm.get('away_tee')?.setValue(null);
      }),
    );

    // Auto-validate on changes (debounced)
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

  get holesControls() {
    return (this.matchForm.get('holes') as FormArray).controls as FormGroup[];
  }

  get selectedTeeHome(): Tee | null {
    return this.matchForm.get('home_tee')?.value;
  }

  get selectedTeeAway(): Tee | null {
    return this.matchForm.get('away_tee')?.value;
  }

  validateMatch(): void {
    if (this.matchForm.invalid) return;

    this.isValidating = true;
    const formValue = this.matchForm.value;
    const homeTee = formValue.home_tee as Tee;
    const awayTee = formValue.away_tee as Tee;
    const holes = formValue.holes as { gross_home: number; gross_away: number }[];

    const homeRound: RoundValidationRequest = {
      date_played: formValue.date_played,
      course_handicap: this.calculateCourseHandicap(formValue.home_golfer, homeTee),
      holes: holes.map((h, i) => ({
        number: homeTee.holes[i].number,
        par: homeTee.holes[i].par,
        stroke_index: homeTee.holes[i].stroke_index,
        gross_score: h.gross_home,
      })),
    };

    const awayRound: RoundValidationRequest = {
      date_played: formValue.date_played,
      course_handicap: this.calculateCourseHandicap(formValue.away_golfer, awayTee),
      holes: holes.map((h, i) => ({
        number: awayTee.holes[i].number,
        par: awayTee.holes[i].par,
        stroke_index: awayTee.holes[i].stroke_index,
        gross_score: h.gross_away,
      })),
    };

    const request: MatchValidationRequest = {
      home_team_rounds: [homeRound],
      away_team_rounds: [awayRound],
    };

    this.matchesService.validateMatch(request).subscribe({
      next: (response) => {
        this.validationResponse = response;
        this.isValidating = false;
        if (!response.is_valid) {
          this.notificationService.showError('Validation Error', 'Some scores are invalid (e.g. exceed max score).');
        }
      },
      error: (err) => {
        this.isValidating = false;
        this.notificationService.showError('Error', 'Failed to validate match.');
      },
    });
  }

  private calculateCourseHandicap(golfer: Golfer, tee: Tee): number {
    if (!golfer.handicap_index) return 0;
    // Simple course handicap calculation: Index * (Slope / 113) + (Rating - Par)
    // For 9 holes, we usually halve the index first if it's an 18-hole index.
    // However, the backend likely handles the final validation.
    // For now, let's just use the index as a placeholder or a simple 9-hole version.
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
      case MatchHoleWinner.HOME: return 'Home';
      case MatchHoleWinner.AWAY: return 'Away';
      case MatchHoleWinner.TIE: return 'Tie';
      default: return '';
    }
  }

  getWinnerSeverity(winner: MatchHoleWinner): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (winner) {
      case MatchHoleWinner.HOME: return 'success';
      case MatchHoleWinner.AWAY: return 'danger';
      case MatchHoleWinner.TIE: return 'secondary';
      default: return 'secondary';
    }
  }
}
