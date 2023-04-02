import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from 'rxjs';

import { AppConfigService } from '../app-config.service';
import { AuthService } from '../auth/auth.service';
import { FlightCreateComponent } from '../flights/flight-create/flight-create.component';
import { FlightsService } from '../flights/flights.service';
import { GolferCreateComponent } from '../golfers/golfer-create/golfer-create.component';
import { GolfersService } from '../golfers/golfers.service';
import { FlightInfo } from '../shared/flight.model';
import { Golfer, GolferAffiliation } from '../shared/golfer.model';
import { User } from '../shared/user.model';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  providers: [SignupComponent]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  currentUser: User | null = null;

  golferNameOptions: string[] = [];
  private golfersSub: Subscription;

  flights: FlightInfo[] = [];
  private flightsSub: Subscription;

  constructor(private authService: AuthService, private appConfigService: AppConfigService, private golfersService: GolfersService, private flightsService: FlightsService, private signupComponent: SignupComponent, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;
      }
    });

    this.golfersSub = this.golfersService.getAllGolfersUpdateListener()
      .subscribe(result => {
        const golferOptions = result.sort((a: Golfer, b: Golfer) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this.golferNameOptions = golferOptions.map(golfer => golfer.name);
      });

    this.golfersService.getAllGolfers();

    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
        this.flights = result.flights;
      });

    this.flightsService.getFlightsList();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.golfersSub.unsubscribe();
    this.flightsSub.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
    this.currentUser = null;
  }

  onPayDues(): void {
    this.signupComponent.onPayDues();
  }

  // TODO: Consolidate `onAddNewGolfer()` usage from header, signups
  // TODO: Move to admin view?
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
          console.log(`[HeaderComponent] Successfully added golfer: ${result.name}`);
          this.snackBar.open(`Successfully added golfer: ${result.name}`, undefined, {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          this.golfersService.getAllGolfers(); // refresh golfer name options
        });
      }
    });
  }

  // TODO: Move to admin view?
  onAddNewFlight(): void {
    const dialogRef = this.dialog.open(FlightCreateComponent, {
      width: '900px',
      data: {
        year: this.appConfigService.currentYear,
        weeks: 18, // typical season length
        divisions: [
          {
            name: "Middle",
            gender: "Men's"
          },
          {
            name: "Senior",
            gender: "Men's"
          },
          {
            name: "Super-Senior",
            gender: "Men's"
          },
          {
            name: "Forward",
            gender: "Ladies'"
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(flightData => {
      if (flightData !== null && flightData !== undefined) {
        const existingFlights = this.flights.filter((f) => f.year == flightData.year);
        const existingFlightNames = existingFlights.map((f) => f.name.toLowerCase());
        if (existingFlightNames.includes(flightData.name.toLowerCase())) {
          this.snackBar.open(`Flight with name '${flightData.name}' and year '${flightData.year}' already exists!`, undefined, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return;
        }

        console.log(flightData);
        this.flightsService.createFlight(flightData).subscribe(result => {
          console.log(`[HeaderComponent] Successfully created flight: ${result.name} (${result.year})`);
          this.snackBar.open(`Successfully created flight: ${result.name} (${result.year})`, undefined, {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          this.flightsService.getFlightsList(); // refresh flights list
        });
      }
    });
  }

}
