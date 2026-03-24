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

import { FlightsService } from '../flights.service';
import { CoursesService } from '../../courses/courses.service';
import { Course } from '../../shared/course.model';
import { FlightCreate, FlightData } from '../../shared/flight.model';
import { Tee } from '../../shared/tee.model';
import { Track } from '../../shared/track.model';
import { NotificationService } from '../../notifications/notification.service';

@Component({
  selector: 'app-flight-create',
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
  ],
  templateUrl: './flight-create.component.html',
  styleUrls: ['./flight-create.component.css']
})
export class FlightCreateComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private flightsService = inject(FlightsService);
  private coursesService = inject(CoursesService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  flightForm!: FormGroup;
  courses = signal<Course[]>([]);
  tees = signal<Tee[]>([]);
  isLoading = signal(false);
  isEditMode = signal(false);
  flightId: number | null = null;

  genderOptions = [
    { label: 'Men\'s', value: 'Men\'s' },
    { label: 'Ladies\'', value: 'Ladies\'' }
  ];

  private subscriptions = new Subscription();

  constructor() {
    // When tees are loaded or cleared, update all division tee controls
    effect(() => {
      const currentTees = this.tees();
      if (this.flightForm) {
        this.divisions.controls.forEach(control => {
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
      this.flightId = +id;
      this.isEditMode.set(true);
      this.loadFlightData(this.flightId);
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
    this.flightForm = this.fb.group({
      name: ['', Validators.required],
      year: [currentYear, [Validators.required, Validators.min(2000)]],
      course_id: [null, Validators.required],
      logo_url: ['apl_golf_logo.png', Validators.required],
      secretary: ['', Validators.required],
      secretary_email: ['', [Validators.required, Validators.email]],
      secretary_phone: [''],
      signup_start_date: [null, Validators.required],
      signup_stop_date: [null, Validators.required],
      start_date: [null, Validators.required],
      weeks: [18, [Validators.required, Validators.min(1)]],
      tee_times: [''],
      locked: [false],
      divisions: this.fb.array([])
    });

    // Watch course changes to load tees
    this.subscriptions.add(
      this.flightForm.get('course_id')?.valueChanges.subscribe(courseId => {
        console.log('Course changed to:', courseId);
        if (courseId) {
          this.loadCourseTees(courseId);
        } else {
          this.tees.set([]);
        }
      })
    );
  }

  private loadFlightData(id: number) {
    this.isLoading.set(true);
    this.flightsService.getData(id);
    this.subscriptions.add(
      this.flightsService.getDataUpdateListener().subscribe({
        next: (flightData: FlightData) => {
          if (flightData && flightData.id === id) {
            this.populateForm(flightData);
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.notificationService.showError('Error', 'Failed to load flight data');
          console.error(err);
        }
      })
    );
  }

  private populateForm(flight: FlightData) {
    this.flightForm.patchValue({
      name: flight.name,
      year: flight.year,
      course_id: flight.course_id,
      logo_url: flight.logo_url || 'apl_golf_logo.png',
      secretary: flight.secretary,
      secretary_email: flight.secretary_email,
      secretary_phone: flight.secretary_phone || '',
      signup_start_date: new Date(flight.signup_start_date),
      signup_stop_date: new Date(flight.signup_stop_date),
      start_date: new Date(flight.start_date),
      weeks: flight.weeks,
      tee_times: flight.tee_times || '',
      locked: false // Assuming default or fetch if available
    });

    // Clear existing divisions and add from flight data
    while (this.divisions.length) {
      this.divisions.removeAt(0);
    }

    flight.divisions.forEach(div => {
      const divisionForm = this.fb.group({
        id: [div.id],
        name: [div.name, Validators.required],
        gender: [div.gender, Validators.required],
        primary_tee_id: [div.primary_tee_id, Validators.required],
        secondary_tee_id: [div.secondary_tee_id, Validators.required]
      });

      // Handle gender changes for this specific division
      divisionForm.get('gender')?.valueChanges.subscribe(() => {
        this.updateTeeControlsState(divisionForm, this.tees());
        divisionForm.get('primary_tee_id')?.setValue(null);
        divisionForm.get('secondary_tee_id')?.setValue(null);
      });

      this.divisions.push(divisionForm);
    });
  }

  get divisions() {
    return this.flightForm.get('divisions') as FormArray;
  }

  addDivision() {
    const division = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      gender: [null, Validators.required],
      primary_tee_id: [{ value: null, disabled: true }, Validators.required],
      secondary_tee_id: [{ value: null, disabled: true }, Validators.required]
    });

    // Handle gender changes for this specific division
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
      this.coursesService.getCoursesUpdateListener().subscribe(data => {
        this.courses.set(data.courses.sort((a, b) => a.name.localeCompare(b.name)));
      })
    );
  }

  private loadCourseTees(courseId: number) {
    this.coursesService.getCourse(courseId);
    this.subscriptions.add(
      this.coursesService.getSelectedCourseUpdateListener().subscribe(course => {
        if (course && course.id === courseId) {
          const allTees: Tee[] = [];
          course.tracks.forEach((track: Track) => {
            track.tees.forEach((tee: Tee) => {
              allTees.push({
                ...tee,
                name: `${track.name} - ${tee.name} (${tee.color})`
              });
            });
          });
          this.tees.set(allTees);
        }
      })
    );
  }

  onSubmit() {
    if (this.flightForm.invalid) {
      this.flightForm.markAllAsTouched();
      this.notificationService.showWarning('Invalid Form', 'Please check all required fields.');
      return;
    }

    this.isLoading.set(true);
    const flightData: FlightCreate = this.flightForm.getRawValue();

    // Adjust dates to appropriate Eastern Time values
    if (flightData.signup_start_date) {
      flightData.signup_start_date = this.setETTime(flightData.signup_start_date, 0, 0);
    }
    if (flightData.signup_stop_date) {
      flightData.signup_stop_date = this.setETTime(flightData.signup_stop_date, 23, 55);
    }
    if (flightData.start_date) {
      flightData.start_date = this.setETTime(flightData.start_date, 0, 0);
    }

    if (this.isEditMode()) {
      flightData.id = this.flightId!;
      this.flightsService.updateFlight(flightData).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.notificationService.showSuccess('Success', 'Flight updated successfully!');
          this.router.navigate(['/flight'], { queryParams: { id: res.id } });
        },
        error: (err) => {
          this.isLoading.set(false);
          const errorMsg = err.error?.detail || err.message || 'An unknown error occurred';
          this.notificationService.showError('Error', `Failed to update flight: ${errorMsg}`);
        }
      });
    } else {
      this.flightsService.createFlight(flightData).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.notificationService.showSuccess('Success', 'Flight created successfully!');
          this.router.navigate(['/flight'], { queryParams: { id: res.id } });
        },
        error: (err) => {
          this.isLoading.set(false);
          const errorMsg = err.error?.detail || err.message || 'An unknown error occurred';
          this.notificationService.showError('Error', `Failed to create flight: ${errorMsg}`);
        }
      });
    }
  }

  private setETTime(date: Date, hour: number, minute: number): Date {
    const localDate = new Date(date);
    localDate.setHours(hour, minute, 0, 0);
    const nyDateStr = localDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const nyDate = new Date(nyDateStr);
    const offset = localDate.getTime() - nyDate.getTime();
    return new Date(localDate.getTime() + offset);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
