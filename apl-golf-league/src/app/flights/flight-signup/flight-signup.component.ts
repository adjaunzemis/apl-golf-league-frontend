import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FlightData, FlightInfo } from '../../shared/flight.model';
import { FlightsService } from '../flights.service';
import { Golfer } from '../../shared/golfer.model';
import { GolfersService } from '../../golfers/golfers.service';
import { DivisionData } from '../../shared/division.model';
import { ErrorDialogComponent } from '../../shared/error/error-dialog/error-dialog.component';
import { AppConfigService } from 'src/app/app-config.service';

@Component({
  selector: 'app-flight-signup',
  templateUrl: './flight-signup.component.html',
  styleUrls: ['./flight-signup.component.css']
})
export class FlightSignupComponent implements OnInit, OnDestroy {
  private currentYear: number;

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

  newTeam: FormGroup;

  constructor(private appConfigService: AppConfigService, private flightsService: FlightsService, private golfersService: GolfersService, private formBuilder: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentYear = this.appConfigService.currentYear;

    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
        this.flights = result.flights.filter(flight => flight.year === this.currentYear);
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

        const currentDate = new Date();
        this.isSelectedFlightSignupWindowOpen = this.selectedFlight.signup_start_date <= currentDate && this.selectedFlight.signup_stop_date >= currentDate;
      });

    this.flightsService.getFlightsList(0, 100, this.currentYear); // TODO: Remove unneeded filters

    this.newTeam = this.formBuilder.group({
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

  onSubmitTeam(): void {
    // Check for unique team name
    const newTeamName = this.teamNameControl.value as string;
    if (this.selectedFlight.teams) {
      for (const team of this.selectedFlight.teams) {
        if (team.name.toLowerCase() === newTeamName.toLowerCase()) {
          this.dialog.open(ErrorDialogComponent, {
            data: { title: "Team Sign-Up Error", message: `Team name '${newTeamName}' is already taken!` }
          });
          return;
        }
      }
    }

    // Extract new team signup info from form
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

    // Check for exactly one captain
    let hasCaptain = false;
    for (const newTeamGolfer of newTeamGolfers) {
      if (newTeamGolfer.role.toLowerCase() == 'captain') {
        if (!hasCaptain) {
          hasCaptain = true;
        } else {
          this.dialog.open(ErrorDialogComponent, {
            data: { title: "Team Sign-Up Error", message: `Team must have only one captain!` }
          });
          return;
        }
      }
    }
    if (!hasCaptain) {
      this.dialog.open(ErrorDialogComponent, {
        data: { title: "Team Sign-Up Error", message: `Team must have a captain!` }
      });
      return;
    }

    // Check for golfers already on existing teams
    for (const newTeamGolfer of newTeamGolfers) {
      if (this.selectedFlight.teams) {
        for (const team of this.selectedFlight.teams) {
          for (const teamGolfer of team.golfers) {
            if (teamGolfer.golfer_id === newTeamGolfer.golfer.id) {
              this.dialog.open(ErrorDialogComponent, {
                data: { title: "Team Sign-Up Error", message: `Golfer '${newTeamGolfer.golfer.name}' is already on team '${team.name}'!` }
              });
              return;
            }
          }
        }
      }
    }

    // Submit new team signup
    this.flightsService.createTeam(newTeamName)
      .subscribe(team => {
        console.log(`Created team '${team.name}' (id=${team.id})`);

        this.flightsService.createFlightTeamLink(this.selectedFlight.id, team.id)
          .subscribe(flightTeamLink => {
            console.log(`Linked team '${team.name}' (id=${flightTeamLink.team_id}) with flight '${this.selectedFlight.name}' (id=${flightTeamLink.flight_id})`);

            const teamGolferLinkSubs: Observable<{ team_id: number, golfer_id: number, division_id: number, role: string }>[] = [];
            for (let newTeamGolfer of newTeamGolfers) {
              teamGolferLinkSubs.push(this.flightsService.createTeamGolferLink(team.id, newTeamGolfer.golfer.id, newTeamGolfer.role, newTeamGolfer.division.id));
            }
            forkJoin(teamGolferLinkSubs).subscribe(results => {
              results.forEach(result => console.log(`Linked golfer (id=${result.golfer_id}) with team (id=${result.team_id}): role=${result.role}, division_id=${result.division_id}`));
            }, error => {
              console.error(`Unable to link golfers to team ${team.name}: ${error}`);
            }, () => {
              console.log(`Successfully submitted new team '${team.name}'!`);

              this.isLoadingSelectedFlight = true;
              this.getSelectedFlightData(this.selectedFlight.id);
            });
          }, error => console.error(`Unable to link team ${team.name} to flight ${this.selectedFlight.name}: ${error}`));
      }, error => console.error(`Unable to create team ${newTeamName}: ${error}`));
  }

  getTeamGolfersArray(): FormArray {
    return this.newTeam.get('teamGolfers') as FormArray;
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
}
