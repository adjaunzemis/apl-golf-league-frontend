import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { TeamCreate, TeamGolferCreate } from "../shared/team.model";
import { DivisionData } from './../shared/division.model';
import { Golfer, GolferAffiliation } from "../shared/golfer.model";
import { GolfersService } from "../golfers/golfers.service";
import { GolferCreateComponent } from "../golfers/golfer-create/golfer-create.component";
import { ErrorDialogComponent } from "../shared/error/error-dialog/error-dialog.component";

@Component({
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit, OnDestroy {

  teamNameControl: FormControl = new FormControl(this.data.teamName, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("^[a-zA-Z' ]*$")]);
  newTeamForm: FormGroup

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = []
  filteredGolferOptionsArray: Observable<Golfer[]>[] = [];
  roleOptions = ['Captain', 'Player'];

  divisions: DivisionData[] = [];

  constructor(public dialogRef: MatDialogRef<TeamCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: {teamName: string, golfers: TeamGolferCreate[], divisions: DivisionData[]}, private formBuilder: FormBuilder, private dialog: MatDialog, private golfersService: GolfersService) { }

  ngOnInit(): void {
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
    this.addNewTeamGolferForm();
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
        this.dialog.open(ErrorDialogComponent, {
          data: { title: "Team Sign-Up Error", message: `Invalid golfer name: ${golferName}` }
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

  // TODO: Consolidate with other implementations (admin panel)
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
          this.dialog.open(ErrorDialogComponent, {
            data: { title: "New Golfer Error", message: `Golfer with name '${golferData.name}' already exists!` }
          });
          return;
        }

        this.golfersService.createGolfer(golferData.name, golferData.affiliation, golferData.email !== '' ? golferData.email : null, golferData.phone !== '' ? golferData.phone : null).subscribe(result => {
          console.log(`[SignupComponent] Successfully added golfer: ${result.name}`);
          this.golfersService.getAllGolfers(); // refresh golfer name options
        });
      }
    });
  }

}
