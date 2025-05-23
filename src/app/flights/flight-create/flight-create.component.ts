import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';

import { FlightCreate } from '../../shared/flight.model';
import { DivisionCreate } from '../../shared/division.model';
import { Course } from '../../shared/course.model';
import { CoursesService } from '../../courses/courses.service';

@Component({
  templateUrl: './flight-create.component.html',
  styleUrls: ['./flight-create.component.css'],
  standalone: false,
})
export class FlightCreateComponent implements OnInit, OnDestroy {
  nameControl: UntypedFormControl = new UntypedFormControl(this.data.name, [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25),
    Validators.pattern("^[a-zA-Z' ]*$"),
  ]);
  yearControl: UntypedFormControl = new UntypedFormControl(this.data.year, [Validators.required]);
  courseControl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]); // TODO: Set default state from data input
  logoUrlControl: UntypedFormControl = new UntypedFormControl(this.data.logo_url, [
    Validators.required,
  ]);
  secretaryControl: UntypedFormControl = new UntypedFormControl(this.data.secretary, [
    Validators.required,
    Validators.pattern("^[a-zA-Z' ]*$"),
  ]);
  secretaryEmailControl: UntypedFormControl = new UntypedFormControl(this.data.secretary_email, [
    Validators.required,
    Validators.email,
  ]);
  secretaryPhoneControl: UntypedFormControl = new UntypedFormControl(this.data.secretary_phone, []);
  signupStartDateControl: UntypedFormControl = new UntypedFormControl(this.data.signup_start_date, [
    Validators.required,
  ]);
  signupStopDateControl: UntypedFormControl = new UntypedFormControl(this.data.signup_stop_date, [
    Validators.required,
  ]);
  startDateControl: UntypedFormControl = new UntypedFormControl(this.data.start_date, [
    Validators.required,
  ]);
  weeksControl: UntypedFormControl = new UntypedFormControl(this.data.weeks, [Validators.required]);
  teeTimesControl: UntypedFormControl = new UntypedFormControl(this.data.tee_times, []);
  // lockedControl: FormControl = new FormControl(this.data.locked, [Validators.required]);

  // TODO: Make this more robust to varying numbers/types of divisions
  division1NameControl: UntypedFormControl = new UntypedFormControl(this.data.divisions[0].name, [
    Validators.required,
    Validators.pattern("^[a-zA-Z' ]*$"),
  ]);
  division1GenderControl: UntypedFormControl = new UntypedFormControl(
    this.data.divisions[0].gender,
    [Validators.required],
  );
  division1PrimaryTeeControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);
  division1SecondaryTeeControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);

  division2NameControl: UntypedFormControl = new UntypedFormControl(this.data.divisions[1].name, [
    Validators.required,
    Validators.pattern("^[a-zA-Z' ]*$"),
  ]);
  division2GenderControl: UntypedFormControl = new UntypedFormControl(
    this.data.divisions[1].gender,
    [Validators.required],
  );
  division2PrimaryTeeControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);
  division2SecondaryTeeControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);

  division3NameControl: UntypedFormControl = new UntypedFormControl(this.data.divisions[2].name, [
    Validators.required,
    Validators.pattern("^[a-zA-Z' ]*$"),
  ]);
  division3GenderControl: UntypedFormControl = new UntypedFormControl(
    this.data.divisions[2].gender,
    [Validators.required],
  );
  division3PrimaryTeeControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);
  division3SecondaryTeeControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);

  division4NameControl: UntypedFormControl = new UntypedFormControl(this.data.divisions[3].name, [
    Validators.required,
    Validators.pattern("^[a-zA-Z' ]*$"),
  ]);
  division4GenderControl: UntypedFormControl = new UntypedFormControl(
    this.data.divisions[3].gender,
    [Validators.required],
  );
  division4PrimaryTeeControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);
  division4SecondaryTeeControl: UntypedFormControl = new UntypedFormControl(null, [
    Validators.required,
  ]);

  courseOptions: Course[] = [];
  courseListSub: Subscription;

  selectedCourse: Course;
  selectedCourseSub: Subscription;

  private divisionTeeIdMap: Record<string, number> = {};
  teeInfoOptions: string[] = [];

  divisionGenderOptions: string[] = ["Men's", "Ladies'"];

  constructor(
    public dialogRef: MatDialogRef<FlightCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FlightCreate,
    private coursesService: CoursesService,
  ) {}

  ngOnInit(): void {
    this.courseListSub = this.coursesService.getCoursesUpdateListener().subscribe((result) => {
      this.courseOptions = result.courses.sort((a: Course, b: Course) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      // Set controls for initial selections (if populated)
      if (this.data.course_id) {
        const course = this.courseOptions.filter((c) => c.id === this.data.course_id)[0];
        this.courseControl.setValue(course);
        this.coursesService.getCourse(course.id);
      }
    });
    this.coursesService.getCourses(true); // include inactive courses

    this.selectedCourseSub = this.coursesService
      .getSelectedCourseUpdateListener()
      .subscribe((result) => {
        this.selectedCourse = result;
        this.updateDivisionOptions();
      });
  }

  ngOnDestroy(): void {
    this.courseListSub.unsubscribe();
    this.selectedCourseSub.unsubscribe();
  }

  onSubmit(): void {
    let flightName: string = this.nameControl.value;
    flightName = flightName
      .split(' ')
      .map((namePart) => namePart.charAt(0).toUpperCase() + namePart.slice(1))
      .join(' ')
      .trim();

    // TODO: Fix hard-coding of 4 divisions
    const flightDivisions: DivisionCreate[] = [];
    flightDivisions.push({
      id:
        this.data.divisions[0] && this.data.divisions[0].id ? this.data.divisions[0].id : undefined,
      name: this.division1NameControl.value.trim(),
      gender: this.division1GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeIdMap[this.division1PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeIdMap[this.division1SecondaryTeeControl.value],
    });
    flightDivisions.push({
      id:
        this.data.divisions[1] && this.data.divisions[1].id ? this.data.divisions[1].id : undefined,
      name: this.division2NameControl.value.trim(),
      gender: this.division2GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeIdMap[this.division2PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeIdMap[this.division2SecondaryTeeControl.value],
    });
    flightDivisions.push({
      id:
        this.data.divisions[2] && this.data.divisions[2].id ? this.data.divisions[2].id : undefined,
      name: this.division3NameControl.value.trim(),
      gender: this.division3GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeIdMap[this.division3PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeIdMap[this.division3SecondaryTeeControl.value],
    });
    flightDivisions.push({
      id:
        this.data.divisions[3] && this.data.divisions[3].id ? this.data.divisions[3].id : undefined,
      name: this.division4NameControl.value.trim(),
      gender: this.division4GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeIdMap[this.division4PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeIdMap[this.division4SecondaryTeeControl.value],
    });

    const flightData: FlightCreate = {
      id: this.data.id ? this.data.id : undefined,
      name: flightName,
      year: this.yearControl.value,
      course_id: this.courseControl.value.id,
      logo_url: this.logoUrlControl.value.trim(),
      secretary: this.secretaryControl.value.trim(),
      secretary_email: this.secretaryEmailControl.value.trim(),
      secretary_phone: this.secretaryPhoneControl.value,
      signup_start_date: this.signupStartDateControl.value,
      signup_stop_date: this.signupStopDateControl.value,
      start_date: this.startDateControl.value,
      weeks: this.weeksControl.value,
      tee_times: this.teeTimesControl.value,
      // locked: this.lockedControl.value
      divisions: flightDivisions,
    };

    this.dialogRef.close(flightData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCourseSelected(selection: MatSelectChange): void {
    this.coursesService.getCourse((selection.value as Course).id);

    // Clear selected division tees
    this.division1PrimaryTeeControl.reset();
    this.division1SecondaryTeeControl.reset();
    this.division2PrimaryTeeControl.reset();
    this.division2SecondaryTeeControl.reset();
    this.division3PrimaryTeeControl.reset();
    this.division3SecondaryTeeControl.reset();
    this.division4PrimaryTeeControl.reset();
    this.division4SecondaryTeeControl.reset();
  }

  private updateDivisionOptions(): void {
    // Update division tee options mappings
    const teeIdDivisionMap: Record<number, string> = {};
    this.divisionTeeIdMap = {};
    this.teeInfoOptions = [];
    for (const track of this.selectedCourse.tracks) {
      for (const tee of track.tees) {
        const teeInfo = `${tee.name}, ${track.name} (${tee.gender}, ${tee.rating}/${tee.slope})`;
        teeIdDivisionMap[tee.id] = teeInfo;
        this.divisionTeeIdMap[teeInfo] = tee.id;
        this.teeInfoOptions.push(teeInfo);
      }
    }

    // Set controls for initial selections (if populated)
    if (this.data.divisions[0]) {
      const division = this.data.divisions[0];
      if (division.id && division.primary_tee_id in teeIdDivisionMap) {
        this.division1PrimaryTeeControl.setValue(teeIdDivisionMap[division.primary_tee_id]);
      }
      if (division.id && division.secondary_tee_id in teeIdDivisionMap) {
        this.division1SecondaryTeeControl.setValue(teeIdDivisionMap[division.secondary_tee_id]);
      }
    }
    if (this.data.divisions[1]) {
      const division = this.data.divisions[1];
      if (division.id && division.primary_tee_id in teeIdDivisionMap) {
        this.division2PrimaryTeeControl.setValue(teeIdDivisionMap[division.primary_tee_id]);
      }
      if (division.id && division.secondary_tee_id in teeIdDivisionMap) {
        this.division2SecondaryTeeControl.setValue(teeIdDivisionMap[division.secondary_tee_id]);
      }
    }
    if (this.data.divisions[2]) {
      const division = this.data.divisions[2];
      if (division.id && division.primary_tee_id in teeIdDivisionMap) {
        this.division3PrimaryTeeControl.setValue(teeIdDivisionMap[division.primary_tee_id]);
      }
      if (division.id && division.secondary_tee_id in teeIdDivisionMap) {
        this.division3SecondaryTeeControl.setValue(teeIdDivisionMap[division.secondary_tee_id]);
      }
    }
    if (this.data.divisions[3]) {
      const division = this.data.divisions[3];
      if (division.id && division.primary_tee_id in teeIdDivisionMap) {
        this.division4PrimaryTeeControl.setValue(teeIdDivisionMap[division.primary_tee_id]);
      }
      if (division.id && division.secondary_tee_id in teeIdDivisionMap) {
        this.division4SecondaryTeeControl.setValue(teeIdDivisionMap[division.secondary_tee_id]);
      }
    }
  }
}
