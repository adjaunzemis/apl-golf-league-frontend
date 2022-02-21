import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Golfer } from 'src/app/shared/golfer.model';

import { FlightInfo } from '../../shared/flight.model';

@Component({
  selector: 'app-flight-signup',
  templateUrl: './flight-signup.component.html',
  styleUrls: ['./flight-signup.component.css']
})
export class FlightSignupComponent implements OnInit {
  isLoading = true;

  teamNameControl = new FormControl();

  flightControl = new FormControl('', Validators.required);
  flights: FlightInfo[] = [ // TODO: Query flight info from database
    { id: 1, name: "Diamond Ridge", year: 2022, course: "Diamond Ridge Golf Course" },
    { id: 2, name: "Fairway Hills A", year: 2022, course: "Fairway Hills Golf Course" },
    { id: 3, name: "Fairway Hills B", year: 2022, course: "Fairway Hills Golf Course" },
    { id: 4, name: "Rattlewood", year: 2022, course: "Rattlewood Golf Course" }
  ];

  golfers: Golfer[] = [ // TODO: Query golfers from database
    { id: 1, name: "George P. Burdell", affiliation: "Non-APL Employee" },
    { id: 2, name: "Merle Tuve", affiliation: "APL Retiree" },
    { id: 3, name: "Andris Jaunzemis", affiliation: "APL Employee" },
  ]

  constructor() { }

  ngOnInit(): void {
    this.isLoading = false;
  }

}
