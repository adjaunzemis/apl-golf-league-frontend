import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from 'rxjs';

import { FlightData, FlightInfo } from '../../shared/flight.model';
import { FlightsService } from '../flights.service';
import { AddTeamGolferData, Golfer } from '../../shared/golfer.model';
import { GolfersService } from '../../golfers/golfers.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-flight-signup',
  templateUrl: './flight-signup.component.html',
  styleUrls: ['./flight-signup.component.css']
})
export class FlightSignupComponent implements OnInit, OnDestroy {
  isLoadingFlights = true;
  isLoadingSelectedFlight = false;
  isLoadingGolfers = true;

  teamNameControl = new FormControl();

  flightControl = new FormControl('', Validators.required);

  private flightsSub: Subscription;
  flights: FlightInfo[] = [ // TODO: Query flight info from database
    { id: 1, name: "Diamond Ridge", year: 2022, course: "Diamond Ridge Golf Course" },
    { id: 2, name: "Fairway Hills A", year: 2022, course: "Fairway Hills Golf Course" },
    { id: 3, name: "Fairway Hills B", year: 2022, course: "Fairway Hills Golf Course" },
    { id: 4, name: "Rattlewood", year: 2022, course: "Rattlewood Golf Course" }
  ];

  selectedFlight: FlightData;
  private selectedFlightSub: Subscription;

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  filteredGolferOptionsArray: Observable<Golfer[]>[] = [];
  roleOptions = ['Captain', 'Player'];

  newTeam: FormGroup;

  constructor(private flightsService: FlightsService, private golfersService: GolfersService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
        this.flights = result.flights; // TODO: Filter to unlocked flights only
        this.isLoadingFlights = false;
      });

    this.selectedFlightSub = this.flightsService.getFlightUpdateListener()
      .subscribe(result => {
        this.selectedFlight = result;
        this.isLoadingSelectedFlight = false;
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
        this.isLoadingGolfers = false;
      });

    this.flightsService.getFlightsList(0, 100); // TODO: Remove unneeded filters
    this.golfersService.getAllGolfers();

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
    console.log("Submitting team not yet implemented...");
  }

  getTeamGolfersArray(): FormArray {
    return this.newTeam.get('teamGolfers') as FormArray;
  }

  addNewTeamGolferForm(): void {
    const newTeamGolferForm = this.formBuilder.group({
      golfer: new FormControl("", Validators.required),
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

}
