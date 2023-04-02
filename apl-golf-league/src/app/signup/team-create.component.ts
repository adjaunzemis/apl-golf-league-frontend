import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { TeamCreate, TeamGolferCreate } from "../shared/team.model";
import { DivisionData } from './../shared/division.model';
import { Golfer, GolferAffiliation } from "../shared/golfer.model";
import { GolfersService } from "../golfers/golfers.service";
import { GolferCreateComponent } from "../golfers/golfer-create/golfer-create.component";

@Component({
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit, OnDestroy {

  updateMode: boolean = false;

  teamNameControl: FormControl = new FormControl(this.data.teamName, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("^[a-zA-Z' ]*$")]);
  newTeamForm: FormGroup

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferOptionsArray: Observable<Golfer[]>[] = [];
  roleOptions = ['Captain', 'Player'];

  divisions: DivisionData[] = [];

  constructor(public dialogRef: MatDialogRef<TeamCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: {teamId: number, teamName: string, teamGolfers: TeamGolferCreate[], divisions: DivisionData[]}, private formBuilder: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar, private golfersService: GolfersService) { }

  ngOnInit(): void {
    if (this.data.teamId > 0 && this.data.teamName.length > 0 && this.data.teamGolfers.length > 0) {
      this.updateMode = true;
    }

    this.teamNameControl.setValue(this.data.teamName);
    this.divisions = this.data.divisions;

    this.golfersSub = this.golfersService.getAllGolfersUpdateListener()
      .subscribe(result => {
        this.golferOptions = result.sort((a: Golfer, b: Golfer) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this.golferNameOptions = result.map(golfer => golfer.name);
      });

    this.golfersService.getAllGolfers();
    this.newTeamForm = this.formBuilder.group({
      teamGolfers: this.formBuilder.array([])
    });

    if (this.data.teamGolfers.length > 0) {
      for (let idx = 0; idx < this.data.teamGolfers.length; idx++) {
        this.addNewTeamGolferForm();
        const newTeamGolferForm = this.getTeamGolfersArray().at(idx);

        const teamGolfer = this.data.teamGolfers[idx];
        newTeamGolferForm.setValue({
          golfer: teamGolfer.golfer.name,
          division: teamGolfer.division,
          role: teamGolfer.role
        });
      }
    } else {
      this.addNewTeamGolferForm();
    }
  }

  ngOnDestroy(): void {
    this.golfersSub.unsubscribe();
  }

  onSubmit(): void {
    // Extract new team signup info from form
    let teamName: string = this.teamNameControl.value;
    teamName = teamName.split(' ').map(namePart => (namePart.charAt(0).toUpperCase() + namePart.slice(1))).join(' ').trim();

    let teamGolfers: TeamGolferCreate[] = [];
    for (let idx = 0; idx < this.getTeamGolfersArray().length; idx++) {
      const newTeamGolferForm = this.getTeamGolfersArray().at(idx);

      const golferName = newTeamGolferForm.value.golfer as string;

      const golferMatches = this.golferOptions.filter((g) => g.name === golferName);
      if (golferMatches.length !== 1) {
        this.snackBar.open(`Invalid golfer name: ${golferName}`, undefined, {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      const golfer = golferMatches[0];

      teamGolfers.push({
        golfer: golfer,
        role: newTeamGolferForm.value.role as string,
        division: newTeamGolferForm.value.division as DivisionData
      });
    }

    const teamData: TeamCreate = {
      name: teamName,
      golfers: teamGolfers
    };

    if (this.data.teamId > 0) {
      teamData.id = this.data.teamId;
    }

    this.dialogRef.close(teamData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTeamGolfersArray(): FormArray {
    return this.newTeamForm.get('teamGolfers') as FormArray;
  }

  addNewTeamGolferForm(): void {
    const newTeamGolferForm = this.formBuilder.group({
      golfer: new FormControl("", [Validators.required, this.checkGolferName.bind(this)]),
      role: new FormControl("", Validators.required),
      division: new FormControl("", Validators.required)
    });

    this.filteredGolferOptionsArray.push(newTeamGolferForm.controls['golfer'].valueChanges.pipe(
      startWith(''),
      map(value => {
        if (this.isGolfer(value)) {
          return this._filter(value.name);
        } else {
          return this._filter(value);
        }
      }),
    ));

    this.getTeamGolfersArray().push(newTeamGolferForm);
  }

  removeNewTeamGolferForm(idx: number): void {
    this.getTeamGolfersArray().removeAt(idx);
    this.filteredGolferOptionsArray.splice(idx, 1);
  }

  private isGolfer(object: any): object is Golfer {
    return (<Golfer> object).name !== undefined;
  }

  private _filter(value: string): Golfer[] {
    const filterValue = value.toLowerCase();
    return this.golferOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private checkGolferName(control: FormControl): { [s: string]: boolean } | null {
    if (this.golferNameOptions.indexOf(control.value) === -1) {
      return { 'golferNameInvalid': true };
    }
    return null;
  }

  // TODO: Consolidate with other implementations (e.g. admin panel)
  onAddNewGolfer(): void {
    const dialogRef = this.dialog.open(GolferCreateComponent, {
      width: '300px',
      data: {
        name: '',
        affiliation: GolferAffiliation.APL_EMPLOYEE,
        email: '',
        phone: ''
      }
    });

    dialogRef.afterClosed().subscribe(golferData => {
      if (golferData !== null && golferData !== undefined) {
        const golferNameOptionsLowercase = this.golferNameOptions.map((name) => name.toLowerCase());
        if (golferNameOptionsLowercase.includes(golferData.name.toLowerCase())) {
          this.snackBar.open(`Golfer with name '${golferData.name}' already exists!`, undefined, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return;
        }

        this.golfersService.createGolfer(golferData.name, golferData.affiliation, golferData.email !== '' ? golferData.email : null, golferData.phone !== '' ? golferData.phone : null).subscribe(result => {
          console.log(`[SignupComponent] Successfully added golfer: ${result.name}`);
          this.snackBar.open(`Successfully added golfer: ${result.name}`, undefined, {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          this.golfersService.getAllGolfers(); // refresh golfer name options
        });
      }
    });
  }

}
