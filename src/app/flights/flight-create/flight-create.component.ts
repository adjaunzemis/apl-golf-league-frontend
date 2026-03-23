import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import { FlightCreate } from '../../shared/flight.model';
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
export class FlightCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private flightsService = inject(FlightsService);
  private coursesService = inject(CoursesService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  flightForm!: FormGroup;
  courses = signal<Course[]>([]);
  tees = signal<Tee[]>([]);
  isLoading = signal(false);

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadCourses();
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
      secretary_phone: ['', Validators.required],
      signup_start_date: [null, Validators.required],
      signup_stop_date: [null, Validators.required],
      start_date: [null, Validators.required],
      weeks: [18, [Validators.required, Validators.min(1)]],
      tee_times: [''],
      locked: [false],
      divisions: this.fb.array([])
    });

    // Watch course changes to load tees
    this.flightForm.get('course_id')?.valueChanges.subscribe(courseId => {
      console.log('Course changed to:', courseId);
      if (courseId) {
        this.loadCourseTees(courseId);
      } else {
        this.tees.set([]);
      }
    });

    // Add at least one division by default
    this.addDivision();
  }

  get divisions() {
    return this.flightForm.get('divisions') as FormArray;
  }

  addDivision() {
    const division = this.fb.group({
      name: ['', Validators.required],
      gender: [null, Validators.required],
      primary_tee_id: [null, Validators.required],
      secondary_tee_id: [null, Validators.required]
    });

    // Clear tee selections if gender changes
    division.get('gender')?.valueChanges.subscribe(() => {
      division.get('primary_tee_id')?.setValue(null);
      division.get('secondary_tee_id')?.setValue(null);
    });

    this.divisions.push(division);
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
    this.coursesService.getCoursesUpdateListener().subscribe(data => {
      this.courses.set(data.courses.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }

  private loadCourseTees(courseId: number) {
    this.coursesService.getCourse(courseId);
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
    });
  }

  onSubmit() {
    console.log('onSubmit called');
    if (this.flightForm.invalid) {
      console.log('Form is invalid', this.flightForm.errors);
      this.flightForm.markAllAsTouched();
      this.notificationService.showWarning('Invalid Form', 'Please check all required fields.');
      return;
    }

    this.isLoading.set(true);
    const flightData: FlightCreate = this.flightForm.value;
    console.log('Submitting flight data:', flightData);
    
    this.flightsService.createFlight(flightData).subscribe({
      next: (res) => {
        console.log('Flight created successfully:', res);
        this.isLoading.set(false);
        this.notificationService.showSuccess('Success', 'Flight created successfully!');
        this.router.navigate(['/flight'], { queryParams: { id: res.id } });
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error creating flight:', err);
        const errorMsg = err.error?.detail || err.message || 'An unknown error occurred';
        this.notificationService.showError('Error', `Failed to create flight: ${errorMsg}`);
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
