import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FlightInfo } from '../../shared/flight.model';
import { Golfer } from '../../shared/golfer.model';
import { GolfersService } from '../../golfers/golfers.service';

@Component({
  selector: 'app-flight-signup',
  templateUrl: './flight-signup.component.html',
  styleUrls: ['./flight-signup.component.css']
})
export class FlightSignupComponent implements OnInit, OnDestroy {
  isLoading = true;

  teamNameControl = new FormControl();

  flightControl = new FormControl('', Validators.required);
  flights: FlightInfo[] = [ // TODO: Query flight info from database
    { id: 1, name: "Diamond Ridge", year: 2022, course: "Diamond Ridge Golf Course" },
    { id: 2, name: "Fairway Hills A", year: 2022, course: "Fairway Hills Golf Course" },
    { id: 3, name: "Fairway Hills B", year: 2022, course: "Fairway Hills Golf Course" },
    { id: 4, name: "Rattlewood", year: 2022, course: "Rattlewood Golf Course" }
  ];

  private golfersSub: Subscription;
  golfers: Golfer[] = [];

  constructor(private golfersService: GolfersService) { }

  ngOnInit(): void {
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
        this.isLoading = false;
      });

    this.golfersService.getAllGolfers();
  }

  ngOnDestroy(): void {
      this.golfersSub.unsubscribe();
  }

}
