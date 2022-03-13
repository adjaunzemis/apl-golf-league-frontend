import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FlightData, FlightInfo } from '../../shared/flight.model';
import { FlightsService } from '../flights.service';
import { Golfer, GolferAffiliation } from '../../shared/golfer.model';
import { GolfersService } from '../../golfers/golfers.service';
import { DivisionData } from '../../shared/division.model';
import { ErrorDialogComponent } from '../../shared/error/error-dialog/error-dialog.component';
import { AppConfigService } from 'src/app/app-config.service';
import { GolferCreateComponent } from 'src/app/golfers/golfer-create/golfer-create.component';

@Component({
  selector: 'app-flight-signup',
  templateUrl: './flight-signup.component.html',
  styleUrls: ['./flight-signup.component.css']
})
export class FlightSignupComponent implements OnInit, OnDestroy {
  private currentYear: number;
  currentDate = new Date();

  isLoadingFlights = true;
  isLoadingGolfers = true;
  isLoadingSelectedFlight = false;
  isSelectedFlightSignupWindowOpen = false;

  teamNameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);

  flightControl = new FormControl('', Validators.required);

  private flightsSub: Subscription;
  flights: FlightInfo[] = [];
  selectedFlight: FlightData;
  private selectedFlightSub: Subscription;

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = []
  filteredGolferOptionsArray: Observable<Golfer[]>[] = [];
  roleOptions = ['Captain', 'Player'];

  newTeamForm: FormGroup;

  constructor(private appConfigService: AppConfigService, private flightsService: FlightsService, private golfersService: GolfersService, private formBuilder: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentYear = this.appConfigService.currentYear;

    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
        this.flights = result.flights;
        this.isLoadingFlights = false;

        this.golfersService.getAllGolfers();
      });

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
        this.isLoadingGolfers = false;
      });

    this.selectedFlightSub = this.flightsService.getFlightUpdateListener()
      .subscribe(result => {
        this.selectedFlight = result;
        this.isLoadingSelectedFlight = false;

        this.isSelectedFlightSignupWindowOpen = this.selectedFlight.signup_start_date <= this.currentDate && this.selectedFlight.signup_stop_date >= this.currentDate;
      });

    this.flightsService.getFlightsList(this.currentYear);

    this.newTeamForm = this.formBuilder.group({
      teamGolfers: this.formBuilder.array([])
    });
    this.addNewTeamGolferForm();
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
    this.selectedFlightSub.unsubscribe();
    this.golfersSub.unsubscribe();
  }

  getSelectedFlightData(id: number): void {
    this.isLoadingSelectedFlight = true;
    this.flightsService.getFlight(id);
  }

  getDaysUntilSignup(): number {
    return Math.floor((Date.UTC(this.selectedFlight.signup_start_date.getFullYear(), this.selectedFlight.signup_start_date.getMonth(), this.selectedFlight.signup_start_date.getDate()) - Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  onSubmitTeam(): void {
    // Extract new team signup info from form
    const newTeamName = this.teamNameControl.value as string;

    let newTeamGolfers: { golfer: Golfer, role: string, division: DivisionData }[] = [];
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

      newTeamGolfers.push({
        golfer: golfer,
        role: newTeamGolferForm.value.role as string,
        division: newTeamGolferForm.value.division as DivisionData
      });
    }

    // Submit new team signup
    let golferData : { golfer_id: number, golfer_name: string, division_id: number, role: string }[] = [];

    for (const newTeamGolfer of newTeamGolfers) {
      golferData.push({
        golfer_id: newTeamGolfer.golfer.id,
        golfer_name: newTeamGolfer.golfer.name,
        division_id: newTeamGolfer.division.id,
        role: newTeamGolfer.role
      });
    }

    this.flightsService.createTeam(newTeamName, this.selectedFlight.id, golferData).subscribe(
      team => {
        console.log(`Created team '${team.name}' (id=${team.id})`);
        // TODO: Refresh team data
      },
      error => {
        console.error(`Unable to create team ${newTeamName}`);
        this.dialog.open(ErrorDialogComponent, {
          data: { title: "Team Sign-Up Error", message: error.error.detail }
        });
      }
    );
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
          console.log(`Successfully added golfer: ${result.name}`);
          this.golfersService.getAllGolfers(); // refresh golfer name options
        });
      }
    });
  }

}
