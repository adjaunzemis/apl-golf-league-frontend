import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';

import { TournamentCreate } from '../../shared/tournament.model';
import { DivisionCreate } from '../../shared/division.model';
import { Course } from '../../shared/course.model';
import { CoursesService } from '../../courses/courses.service';

@Component({
  templateUrl: './tournament-create.component.html',
  styleUrls: ['./tournament-create.component.css'],
  standalone: false,
})
export class TournamentCreateComponent implements OnInit {
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
  dateControl: UntypedFormControl = new UntypedFormControl(this.data.date, [Validators.required]);
  membersEntryFeeControl: UntypedFormControl = new UntypedFormControl(this.data.members_entry_fee, [
    Validators.required,
  ]);
  nonMembersEntryFeeControl: UntypedFormControl = new UntypedFormControl(
    this.data.non_members_entry_fee,
    [Validators.required],
  );
  bestballControl: UntypedFormControl = new UntypedFormControl(this.data.bestball, [
    Validators.required,
  ]);
  // TODO: Change mode selections to multi-select combobox
  shotgunControl: UntypedFormControl = new UntypedFormControl(this.data.shotgun, [
    Validators.required,
  ]);
  strokeplayControl: UntypedFormControl = new UntypedFormControl(this.data.strokeplay, [
    Validators.required,
  ]);
  scrambleControl: UntypedFormControl = new UntypedFormControl(this.data.scramble, [
    Validators.required,
  ]);
  individualControl: UntypedFormControl = new UntypedFormControl(this.data.individual, [
    Validators.required,
  ]);
  ryderCupControl: UntypedFormControl = new UntypedFormControl(this.data.ryder_cup, [
    Validators.required,
  ]);
  chachachaControl: UntypedFormControl = new UntypedFormControl(this.data.chachacha, [
    Validators.required,
  ]);
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

  private divisionTeeIdMap: { [teeInfo: string]: number } = {};
  teeInfoOptions: string[] = [];

  divisionGenderOptions: string[] = ["Men's", "Ladies'"];

  constructor(
    public dialogRef: MatDialogRef<TournamentCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TournamentCreate,
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

        // Update division tee options mapping
        this.divisionTeeIdMap = {};
        this.teeInfoOptions = [];
        for (const track of result.tracks) {
          for (const tee of track.tees) {
            const teeInfo = `${tee.name}, ${track.name} (${tee.gender}, ${tee.rating}/${tee.slope})`;
            this.divisionTeeIdMap[teeInfo] = tee.id;
            this.teeInfoOptions.push(teeInfo);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.courseListSub.unsubscribe();
    this.selectedCourseSub.unsubscribe();
  }

  onSubmit(): void {
    let tournamentName: string = this.nameControl.value;
    tournamentName = tournamentName
      .split(' ')
      .map((namePart) => namePart.charAt(0).toUpperCase() + namePart.slice(1))
      .join(' ')
      .trim();

    // TODO: Fix hard-coding of 4 divisions
    let tournamentDivisions: DivisionCreate[] = [];
    tournamentDivisions.push({
      id:
        this.data.divisions[0] && this.data.divisions[0].id ? this.data.divisions[0].id : undefined,
      name: this.division1NameControl.value.trim(),
      gender: this.division1GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeIdMap[this.division1PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeIdMap[this.division1SecondaryTeeControl.value],
    });
    tournamentDivisions.push({
      id:
        this.data.divisions[1] && this.data.divisions[1].id ? this.data.divisions[1].id : undefined,
      name: this.division2NameControl.value.trim(),
      gender: this.division2GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeIdMap[this.division2PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeIdMap[this.division2SecondaryTeeControl.value],
    });
    tournamentDivisions.push({
      id:
        this.data.divisions[2] && this.data.divisions[2].id ? this.data.divisions[2].id : undefined,
      name: this.division3NameControl.value.trim(),
      gender: this.division3GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeIdMap[this.division3PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeIdMap[this.division3SecondaryTeeControl.value],
    });
    tournamentDivisions.push({
      id:
        this.data.divisions[3] && this.data.divisions[3].id ? this.data.divisions[3].id : undefined,
      name: this.division4NameControl.value.trim(),
      gender: this.division4GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeIdMap[this.division4PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeIdMap[this.division4SecondaryTeeControl.value],
    });

    const tournamentData: TournamentCreate = {
      id: this.data.id ? this.data.id : undefined,
      name: tournamentName,
      year: this.yearControl.value,
      course_id: this.courseControl.value.id,
      logo_url: this.logoUrlControl.value.trim(),
      secretary: this.secretaryControl.value.trim(),
      secretary_email: this.secretaryEmailControl.value.trim(),
      secretary_phone: this.secretaryPhoneControl.value,
      signup_start_date: this.signupStartDateControl.value,
      signup_stop_date: this.signupStopDateControl.value,
      date: this.dateControl.value,
      members_entry_fee: this.membersEntryFeeControl.value,
      non_members_entry_fee: this.nonMembersEntryFeeControl.value,
      bestball: this.bestballControl.value,
      shotgun: this.shotgunControl.value,
      strokeplay: this.strokeplayControl.value,
      scramble: this.scrambleControl.value,
      ryder_cup: this.ryderCupControl.value,
      individual: this.individualControl.value,
      chachacha: this.chachachaControl.value,
      // locked: this.lockedControl.value
      divisions: tournamentDivisions,
    };

    this.dialogRef.close(tournamentData);
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
    let teeIdDivisionMap: { [teeId: number]: string } = {};
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
