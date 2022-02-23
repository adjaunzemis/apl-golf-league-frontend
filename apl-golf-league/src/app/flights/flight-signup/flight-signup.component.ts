import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FlightData, FlightInfo } from '../../shared/flight.model';
import { FlightsService } from '../flights.service';
import { AddTeamGolferData, Golfer } from '../../shared/golfer.model';
import { GolfersService } from '../../golfers/golfers.service';

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
  golfers: Golfer[] = [];

  teamSignupInfo: AddTeamGolferData[] = [];

  constructor(private flightsService: FlightsService, private golfersService: GolfersService) { }

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
        this.golfers = result.sort((a: Golfer, b: Golfer) => {
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
  }

  getSelectedFlightData(id: number): void {
    this.isLoadingSelectedFlight = true;
    this.flightsService.getFlight(id);
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
    this.selectedFlightSub.unsubscribe();
    this.golfersSub.unsubscribe();
  }

  addTeamGolferDataToTeam(newTeamGolferData: AddTeamGolferData): void {
    this.teamSignupInfo.push(newTeamGolferData);
  }

}
