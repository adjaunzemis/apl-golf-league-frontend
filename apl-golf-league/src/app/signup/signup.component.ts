import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FlightData, FlightInfo } from '../shared/flight.model';
import { FlightsService } from '../flights/flights.service';
import { TournamentData, TournamentInfo } from '../shared/tournament.model';
import { TournamentsService } from '../tournaments/tournaments.service';
import { Golfer, GolferAffiliation } from '../shared/golfer.model';
import { GolfersService } from '../golfers/golfers.service';
import { GolferCreateComponent } from '../golfers/golfer-create/golfer-create.component';
import { TeamData, TournamentTeamData } from '../shared/team.model';
import { DivisionData } from '../shared/division.model';
import { ErrorDialogComponent } from '../shared/error/error-dialog/error-dialog.component';
import { AppConfigService } from '../app-config.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  private currentYear: number;
  currentDate = new Date();

  selectedTabIdx = 0; // 0 = 'flight', 1 = 'tournament'

  isLoadingGolfers = true;
  isLoadingFlights = true;
  isLoadingTournaments = true;

  isLoadingSelectedFlightOrTournament = false;
  isSelectedSignupWindowOpen = false;

  flightControl = new FormControl('', Validators.required);
  tournamentControl = new FormControl('', Validators.required);

  private flightsSub: Subscription;
  flights: FlightInfo[] = [];
  private selectedFlightSub: Subscription;

  private tournamentsSub: Subscription;
  tournaments: TournamentInfo[] = [];
  private selectedTournamentSub: Subscription;

  selectedFlightOrTournament: FlightData | TournamentData | undefined;

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = []
  filteredGolferOptionsArray: Observable<Golfer[]>[] = [];
  roleOptions = ['Captain', 'Player'];

  newTeamForm: FormGroup;
  teamNameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);

  constructor(private appConfigService: AppConfigService, private flightsService: FlightsService, private tournamentsService: TournamentsService, private golfersService: GolfersService, private formBuilder: FormBuilder, private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentYear = this.appConfigService.currentYear;

    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
        this.flights = result.flights;
        this.isLoadingFlights = false;
      });

    this.selectedFlightSub = this.flightsService.getFlightUpdateListener()
      .subscribe(result => {
        this.selectedFlightOrTournament = result;
        this.isLoadingSelectedFlightOrTournament = false;

        this.isSelectedSignupWindowOpen = this.selectedFlightOrTournament.signup_start_date <= this.currentDate && this.selectedFlightOrTournament.signup_stop_date >= this.currentDate;
      });

    this.flightsService.getFlightsList(this.currentYear);

    this.tournamentsSub = this.tournamentsService.getTournamentsListUpdateListener()
      .subscribe(result => {
        this.tournaments = result.tournaments;
        this.isLoadingTournaments = false;
      });

    this.selectedTournamentSub = this.tournamentsService.getTournamentUpdateListener()
      .subscribe(result => {
        this.selectedFlightOrTournament = result;
        this.isLoadingSelectedFlightOrTournament = false;

        this.isSelectedSignupWindowOpen = this.selectedFlightOrTournament.signup_start_date <= this.currentDate && this.selectedFlightOrTournament.signup_stop_date >= this.currentDate;
      });

    this.tournamentsService.getTournamentsList(this.currentYear);

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

    this.newTeamForm = this.formBuilder.group({
      teamGolfers: this.formBuilder.array([])
    });
    this.addNewTeamGolferForm();

    this.golfersService.getAllGolfers();

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.type) {
          this.setSelectedTabIdxByType(params.type);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
    this.selectedFlightSub.unsubscribe();
    this.tournamentsSub.unsubscribe();
    this.selectedTournamentSub.unsubscribe();
    this.golfersSub.unsubscribe();
  }

  private setSelectedTabIdxByType(type: string): void {
    if ((type.toLowerCase() === "tournament") || (type.toLowerCase() === "tournaments")) {
      this.selectedTabIdx = 1;
    } else {
      this.selectedTabIdx = 0;
    }
    console.log(`[SignupComponent] Selected tab ${this.selectedTabIdx} for type '${type}'`)
    this.onTabIndexChanged(this.selectedTabIdx);
  }

  onTabIndexChanged(tabIdx: number): void {
    this.clearSignupForms();
    this.flightControl.setValue("--");
    this.tournamentControl.setValue("--");
    this.selectedFlightOrTournament = undefined;
  }

  getSelectedFlightData(id: number): void {
    this.isLoadingSelectedFlightOrTournament = true;
    this.flightsService.getFlight(id);
  }

  getSelectedTournamentData(id: number): void {
    this.isLoadingSelectedFlightOrTournament = true;
    this.tournamentsService.getTournament(id);
  }

  getDaysUntilSignup(): number {
    if (!this.selectedFlightOrTournament) {
      return 0;
    }
    return Math.floor((Date.UTC(this.selectedFlightOrTournament.signup_start_date.getFullYear(), this.selectedFlightOrTournament.signup_start_date.getMonth(), this.selectedFlightOrTournament.signup_start_date.getDate()) - Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  getFlightStartOrTournamentDate(): Date {
    if (this.selectedTabIdx === 0) {
      const selectedFlight = this.selectedFlightOrTournament as FlightData;
      return selectedFlight.start_date;
    } else {
      const selectedTournament = this.selectedFlightOrTournament as TournamentData;
      return selectedTournament.date;
    }
  }

  getFlightStartOrTournamentDateLabel(): string {
    if (this.selectedTabIdx === 0) {
      return "Start Date";
    } else {
      return "Tournament Date";
    }
  }

  getSelectedFlightOrTournamentTeams(): TeamData[] {
    if (this.selectedFlightOrTournament) {
      if (this.selectedTabIdx === 0) {
        const selectedFlight = this.selectedFlightOrTournament as FlightData;
        if (!selectedFlight.teams) {
          return []
        }
        return selectedFlight.teams;
      } else {
        const selectedTournament = this.selectedFlightOrTournament as TournamentData;
        if (!selectedTournament.teams) {
          return []
        }
        // return selectedTournament.teams;
        return []; // TODO: Map tournament team data to TeamData[]
      }
    }
    return [];
  }

  // TODO: Conslidate with onSubmitTournamentTeam()
  onSubmitFlightTeam(): void {
    if (!this.selectedFlightOrTournament) {
      return;
    }

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

    this.isLoadingSelectedFlightOrTournament = true
    this.flightsService.createTeam(newTeamName, this.selectedFlightOrTournament.id, golferData).subscribe(
      team => {
        console.log(`[SignupComponent] Created team '${team.name}' (id=${team.id})`);
        this.clearSignupForms();
        if (this.selectedFlightOrTournament) {
          this.getSelectedFlightData(this.selectedFlightOrTournament.id); // refresh flight info to get updated team
        }
      },
      error => {
        console.error(`Unable to create team ${newTeamName}`);
        this.isLoadingSelectedFlightOrTournament = false
      }
    );
  }

  // TODO: Conslidate with onSubmitFlightTeam()
  onSubmitTournamentTeam(): void {
    if (!this.selectedFlightOrTournament) {
      return;
    }

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

    this.isLoadingSelectedFlightOrTournament = true
    this.tournamentsService.createTeam(newTeamName, this.selectedFlightOrTournament.id, golferData).subscribe(
      team => {
        console.log(`[SignupComponent] Created team '${team.name}' (id=${team.id})`);
        this.clearSignupForms();
        if (this.selectedFlightOrTournament) {
          this.getSelectedTournamentData(this.selectedFlightOrTournament.id); // refresh tournament info to get updated team
        }
      },
      error => {
        console.error(`Unable to create team '${newTeamName}'`);
        this.isLoadingSelectedFlightOrTournament = false
      }
    );
  }

  private clearSignupForms(): void {
    this.teamNameControl.setValue("");
    this.teamNameControl.markAsUntouched();
    this.newTeamForm = this.formBuilder.group({
      teamGolfers: this.formBuilder.array([])
    });
    this.addNewTeamGolferForm();
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
          console.log(`[SignupComponent] Successfully added golfer: ${result.name}`);
          this.golfersService.getAllGolfers(); // refresh golfer name options
        });
      }
    });
  }

}
