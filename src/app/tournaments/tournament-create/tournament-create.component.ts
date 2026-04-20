import { Component, OnInit, inject, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { TournamentsService } from '../tournaments.service';
import { CoursesService } from '../../courses/courses.service';
import { Course } from '../../shared/course.model';
import { TournamentCreate, TournamentData } from '../../shared/tournament.model';
import { Tee } from '../../shared/tee.model';
import { Track } from '../../shared/track.model';
import { NotificationService } from '../../notifications/notification.service';

@Component({
  selector: 'app-tournament-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    MessageModule,
    ToggleButtonModule,
  ],
  templateUrl: './tournament-create.component.html',
  styleUrls: ['./tournament-create.component.css'],
})
export class TournamentCreateComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private tournamentsService = inject(TournamentsService);
  private coursesService = inject(CoursesService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tournamentForm!: FormGroup;
  courses = signal<Course[]>([]);
  tees = signal<Tee[]>([]);
  isLoading = signal(false);
  isEditMode = signal(false);
  tournamentId: number | null = null;

  genderOptions = [
    { label: "Men's", value: "Men's" },
    { label: "Ladies'", value: "Ladies'" },
  ];

  private subscriptions = new Subscription();

  constructor() {
    // When tees are loaded or cleared, update all division tee controls
    effect(() => {
      const currentTees = this.tees();
      if (this.tournamentForm) {
        this.divisions.controls.forEach((control) => {
          const division = control as FormGroup;
          this.updateTeeControlsState(division, currentTees);
        });
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.loadCourses();

    // Check for edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tournamentId = +id;
      this.isEditMode.set(true);
      this.loadTournamentData(this.tournamentId);
    } else {
      // Add at least one division by default for create mode
      this.addDivision();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    const currentYear = new Date().getFullYear();
    this.tournamentForm = this.fb.group({
      name: ['', Validators.required],
      year: [currentYear, [Validators.required, Validators.min(2000)]],
      course_id: [null, Validators.required],
      logo_url: ['apl_golf_logo.png', Validators.required],
      secretary: ['', Validators.required],
      secretary_email: ['', [Validators.required, Validators.email]],
      signup_start_date: [null, Validators.required],
      signup_stop_date: [null, Validators.required],
      date: [null, Validators.required],
      members_entry_fee: [0, Validators.required],
      non_members_entry_fee: [0, Validators.required],
      bestball: [0, Validators.required],
      shotgun: [false],
      strokeplay: [false],
      scramble: [false],
      shamble: [false],
      individual: [false],
      ryder_cup: [false],
      chachacha: [false],
      locked: [false],
      divisions: this.fb.array([]),
    });

    // Watch course changes to load tees
    this.subscriptions.add(
      this.tournamentForm.get('course_id')?.valueChanges.subscribe((courseId) => {
        if (courseId) {
          this.loadCourseTees(courseId);
        } else {
          this.tees.set([]);
        }
      }),
    );
  }

  private loadTournamentData(id: number) {
    this.isLoading.set(true);
    this.tournamentsService.getTournament(id);
    this.subscriptions.add(
      this.tournamentsService.getTournamentUpdateListener().subscribe({
        next: (data: TournamentData) => {
          if (data && data.id === id) {
            this.populateForm(data);
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.notificationService.showError('Error', 'Failed to load tournament data');
          console.error(err);
        },
      }),
    );
  }

  private populateForm(tournament: TournamentData) {
    this.tournamentForm.patchValue({
      name: tournament.name,
      year: tournament.year,
      course_id: tournament.course_id,
      logo_url: tournament.logo_url || 'apl_golf_logo.png',
      secretary: tournament.secretary,
      secretary_email: tournament.secretary_email,
      signup_start_date: new Date(tournament.signup_start_date),
      signup_stop_date: new Date(tournament.signup_stop_date),
      date: new Date(tournament.date),
      members_entry_fee: tournament.members_entry_fee,
      non_members_entry_fee: tournament.non_members_entry_fee,
      bestball: tournament.bestball,
      shotgun: tournament.shotgun,
      strokeplay: tournament.strokeplay,
      scramble: tournament.scramble,
      shamble: tournament.shamble,
      individual: tournament.individual,
      ryder_cup: tournament.ryder_cup,
      chachacha: tournament.chachacha,
      locked: false,
    });

    // Clear existing divisions and add from data
    while (this.divisions.length) {
      this.divisions.removeAt(0);
    }

    tournament.divisions.forEach((div) => {
      const divisionForm = this.fb.group({
        id: [div.id],
        name: [div.name, Validators.required],
        gender: [div.gender, Validators.required],
        primary_tee_id: [div.primary_tee_id, Validators.required],
        secondary_tee_id: [div.secondary_tee_id, Validators.required],
      });

      divisionForm.get('gender')?.valueChanges.subscribe(() => {
        this.updateTeeControlsState(divisionForm, this.tees());
        divisionForm.get('primary_tee_id')?.setValue(null);
        divisionForm.get('secondary_tee_id')?.setValue(null);
      });

      this.divisions.push(divisionForm);
    });
  }

  get divisions() {
    return this.tournamentForm.get('divisions') as FormArray;
  }

  addDivision() {
    const division = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      gender: [null, Validators.required],
      primary_tee_id: [{ value: null, disabled: true }, Validators.required],
      secondary_tee_id: [{ value: null, disabled: true }, Validators.required],
    });

    division.get('gender')?.valueChanges.subscribe(() => {
      this.updateTeeControlsState(division, this.tees());
      division.get('primary_tee_id')?.setValue(null);
      division.get('secondary_tee_id')?.setValue(null);
    });

    this.divisions.push(division);
  }

  private updateTeeControlsState(division: FormGroup, availableTees: Tee[]) {
    const gender = division.get('gender')?.value;
    const primaryTee = division.get('primary_tee_id');
    const secondaryTee = division.get('secondary_tee_id');

    if (gender && availableTees.length > 0) {
      primaryTee?.enable({ emitEvent: false });
      secondaryTee?.enable({ emitEvent: false });
    } else {
      primaryTee?.disable({ emitEvent: false });
      secondaryTee?.disable({ emitEvent: false });
    }
  }

  removeDivision(index: number) {
    this.divisions.removeAt(index);
  }

  getFilteredTees(gender: string): Tee[] {
    if (!gender) {
      return [];
    }
    return this.tees().filter((tee) => tee.gender === gender);
  }

  private loadCourses() {
    this.coursesService.getCourses();
    this.subscriptions.add(
      this.coursesService.getCoursesUpdateListener().subscribe((data) => {
        this.courses.set(data.courses.sort((a, b) => a.name.localeCompare(b.name)));
      }),
    );
  }

  private loadCourseTees(courseId: number) {
    this.coursesService.getCourse(courseId);
    this.subscriptions.add(
      this.coursesService.getSelectedCourseUpdateListener().subscribe((course) => {
        if (course && course.id === courseId) {
          const allTees: Tee[] = [];
          course.tracks.forEach((track: Track) => {
            track.tees.forEach((tee: Tee) => {
              allTees.push({
                ...tee,
                name: `${track.name} - ${tee.name} (${tee.color})`,
              });
            });
          });
          this.tees.set(allTees);
        }
      }),
    );
  }

  onSubmit() {
    if (this.tournamentForm.invalid) {
      this.tournamentForm.markAllAsTouched();
      this.notificationService.showWarning('Invalid Form', 'Please check all required fields.');
      return;
    }

    this.isLoading.set(true);
    const tournamentData: TournamentCreate = this.tournamentForm.getRawValue();

    // Adjust dates to ET
    if (tournamentData.signup_start_date) {
      tournamentData.signup_start_date = this.setETTime(tournamentData.signup_start_date);
    }
    if (tournamentData.signup_stop_date) {
      tournamentData.signup_stop_date = this.setETTime(tournamentData.signup_stop_date);
    }
    if (tournamentData.date) {
      tournamentData.date = this.setETTime(tournamentData.date);
    }

    if (this.isEditMode()) {
      tournamentData.id = this.tournamentId!;
      this.tournamentsService.updateTournament(tournamentData).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.notificationService.showSuccess('Success', 'Tournament updated successfully!');
          this.router.navigate(['/tournament'], { queryParams: { id: res.id } });
        },
        error: (err) => {
          this.isLoading.set(false);
          const errorMsg = err.error?.detail || err.message || 'An unknown error occurred';
          this.notificationService.showError('Error', `Failed to update tournament: ${errorMsg}`);
        },
      });
    } else {
      this.tournamentsService.createTournament(tournamentData).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.notificationService.showSuccess('Success', 'Tournament created successfully!');
          this.router.navigate(['/tournament'], { queryParams: { id: res.id } });
        },
        error: (err) => {
          this.isLoading.set(false);
          const errorMsg = err.error?.detail || err.message || 'An unknown error occurred';
          this.notificationService.showError('Error', `Failed to create tournament: ${errorMsg}`);
        },
      });
    }
  }

  private setETTime(date: Date, hour?: number, minute?: number): Date {
    const localDate = new Date(date);
    if (hour !== undefined) {
      localDate.setHours(hour, minute ?? 0, 0, 0);
    }
    const nyDateStr = localDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const nyDate = new Date(nyDateStr);
    const offset = localDate.getTime() - nyDate.getTime();
    return new Date(localDate.getTime() + offset);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
