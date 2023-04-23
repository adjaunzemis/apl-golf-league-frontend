import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';

import { TournamentCreate } from "../../shared/tournament.model";
import { DivisionCreate } from "../../shared/division.model";
import { Course } from "../../shared/course.model";
import { CoursesService } from "../../courses/courses.service";

@Component({
  templateUrl: './tournament-create.component.html',
  styleUrls: ['./tournament-create.component.css']
})
export class TournamentCreateComponent implements OnInit {

  nameControl: FormControl = new FormControl(this.data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("^[a-zA-Z' ]*$")]);
  yearControl: FormControl = new FormControl(this.data.year, [Validators.required])
  courseControl: FormControl = new FormControl(null, [Validators.required]) // TODO: Set default state from data input
  logoUrlControl: FormControl = new FormControl(this.data.logo_url, [Validators.required]);
  secretaryControl: FormControl = new FormControl(this.data.secretary, [Validators.required, Validators.pattern("^[a-zA-Z' ]*$")]);
  secretaryEmailControl: FormControl = new FormControl(this.data.secretary_email, [Validators.required, Validators.email]);
  secretaryPhoneControl: FormControl = new FormControl(this.data.secretary_phone, []);
  signupStartDateControl: FormControl = new FormControl(this.data.signup_start_date, [Validators.required]);
  signupStopDateControl: FormControl = new FormControl(this.data.signup_stop_date, [Validators.required]);
  dateControl: FormControl = new FormControl(this.data.date, [Validators.required]);
  membersEntryFeeControl: FormControl = new FormControl(this.data.members_entry_fee, [Validators.required]);
  nonMembersEntryFeeControl: FormControl = new FormControl(this.data.non_members_entry_fee, [Validators.required]);
  bestballControl: FormControl = new FormControl(this.data.bestball, [Validators.required]);
  // TODO: Change mode selections to multi-select combobox
  shotgunControl: FormControl = new FormControl(this.data.shotgun, [Validators.required]);
  strokeplayControl: FormControl = new FormControl(this.data.strokeplay, [Validators.required]);
  scrambleControl: FormControl = new FormControl(this.data.scramble, [Validators.required]);
  individualControl: FormControl = new FormControl(this.data.individual, [Validators.required]);
  ryderCupControl: FormControl = new FormControl(this.data.ryder_cup, [Validators.required]);
  chachachaControl: FormControl = new FormControl(this.data.chachacha, [Validators.required]);
  // lockedControl: FormControl = new FormControl(this.data.locked, [Validators.required]);

  // TODO: Make this more robust to varying numbers/types of divisions
  division1NameControl: FormControl = new FormControl(this.data.divisions[0].name, [Validators.required, Validators.pattern("^[a-zA-Z' ]*$")]);
  division1GenderControl: FormControl = new FormControl(this.data.divisions[0].gender, [Validators.required]);
  division1PrimaryTeeControl: FormControl = new FormControl(null, [Validators.required]);
  division1SecondaryTeeControl: FormControl = new FormControl(null, [Validators.required]);

  division2NameControl: FormControl = new FormControl(this.data.divisions[1].name, [Validators.required, Validators.pattern("^[a-zA-Z' ]*$")]);
  division2GenderControl: FormControl = new FormControl(this.data.divisions[1].gender, [Validators.required]);
  division2PrimaryTeeControl: FormControl = new FormControl(null, [Validators.required]);
  division2SecondaryTeeControl: FormControl = new FormControl(null, [Validators.required]);

  division3NameControl: FormControl = new FormControl(this.data.divisions[2].name, [Validators.required, Validators.pattern("^[a-zA-Z' ]*$")]);
  division3GenderControl: FormControl = new FormControl(this.data.divisions[2].gender, [Validators.required]);
  division3PrimaryTeeControl: FormControl = new FormControl(null, [Validators.required]);
  division3SecondaryTeeControl: FormControl = new FormControl(null, [Validators.required]);

  division4NameControl: FormControl = new FormControl(this.data.divisions[3].name, [Validators.required, Validators.pattern("^[a-zA-Z' ]*$")]);
  division4GenderControl: FormControl = new FormControl(this.data.divisions[3].gender, [Validators.required]);
  division4PrimaryTeeControl: FormControl = new FormControl(null, [Validators.required]);
  division4SecondaryTeeControl: FormControl = new FormControl(null, [Validators.required]);

  courseOptions: Course[] = [];
  courseListSub: Subscription

  selectedCourse: Course
  selectedCourseSub: Subscription

  private divisionTeeMap: {[teeInfo: string]: number} = {}
  divisionTeeOptions: string[] = []

  divisionGenderOptions: string[] = ["Men's", "Ladies'"]

  constructor(public dialogRef: MatDialogRef<TournamentCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: TournamentCreate, private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.courseListSub = this.coursesService.getCoursesUpdateListener().subscribe(result => {
      this.courseOptions = result.courses.sort((a: Course, b: Course) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });
    this.coursesService.getCourses(true); // include inactive courses

    this.selectedCourseSub = this.coursesService.getSelectedCourseUpdateListener().subscribe(result => {
      this.selectedCourse = result;

      // Update division tee options mapping
      this.divisionTeeMap = {};
      this.divisionTeeOptions = [];
      for (const track of result.tracks) {
        for (const tee of track.tees) {
          const teeInfo = `${tee.name}, ${track.name} (${tee.gender}, ${tee.rating}/${tee.slope})`;
          this.divisionTeeMap[teeInfo] = tee.id;
          this.divisionTeeOptions.push(teeInfo);
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.courseListSub.unsubscribe();
    this.selectedCourseSub.unsubscribe();
  }

  onSubmit(): void {
    let tournamentName: string = this.nameControl.value;
    tournamentName = tournamentName.split(' ').map(namePart => (namePart.charAt(0).toUpperCase() + namePart.slice(1))).join(' ').trim();

    // TODO: Fix hard-coding of 4 divisions
    let tournamentDivisions: DivisionCreate[] = [];
    tournamentDivisions.push({
      name: this.division1NameControl.value.trim(),
      gender: this.division1GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeMap[this.division1PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeMap[this.division1SecondaryTeeControl.value],
    });
    tournamentDivisions.push({
      name: this.division2NameControl.value.trim(),
      gender: this.division2GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeMap[this.division2PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeMap[this.division2SecondaryTeeControl.value],
    });
    tournamentDivisions.push({
      name: this.division3NameControl.value.trim(),
      gender: this.division3GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeMap[this.division3PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeMap[this.division3SecondaryTeeControl.value],
    });
    tournamentDivisions.push({
      name: this.division4NameControl.value.trim(),
      gender: this.division4GenderControl.value.trim(),
      primary_tee_id: this.divisionTeeMap[this.division4PrimaryTeeControl.value],
      secondary_tee_id: this.divisionTeeMap[this.division4SecondaryTeeControl.value],
    });

    const tournamentData: TournamentCreate = {
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
      divisions: tournamentDivisions
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

}
