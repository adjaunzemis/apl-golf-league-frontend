import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Subscription } from 'rxjs';

import { FlightCreate, FlightData } from '../../shared/flight.model';
import { FlightsService } from '../flights.service';
import { FlightCreateComponent } from '../flight-create/flight-create.component';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/user.model';

@Component({
  selector: 'app-flight-home',
  templateUrl: './flight-home.component.html',
  styleUrls: ['./flight-home.component.css']
})
export class FlightHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  isAuthenticated = false;
  private userSub: Subscription;
  currentUser: User | null = null;

  flight: FlightData;
  private flightSub: Subscription;

  currentDate = new Date();

  showScheduleMatrix = false;

  isPlayoffFlight = false;

  constructor(private flightsService: FlightsService, private authService: AuthService, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;
      }
    });

    this.flightSub = this.flightsService.getFlightUpdateListener()
      .subscribe(flightData => {
          console.log(`[FlightHomeComponent] Received data for flight: name=${flightData.name}, year=${flightData.year}, id=${flightData.id}`);
          this.flight = flightData;
          this.isLoading = false;

          if (flightData.name.includes("Playoffs")) {
            console.log(`[FlightHomeComponent] Displaying playoff-specific flight details`)
            this.isPlayoffFlight = true;
          }
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
          if (params.id) {
              console.log("[FlightHomeComponent] Processing route with query parameter: id=" + params.id);
              this.flightsService.getFlight(params.id);
          }
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.flightSub.unsubscribe();
  }

  getFlightEmailList(): string {
    let emailList = "";
    if (this.flight.secretary_email) {
      emailList += this.flight.secretary_email + ";"
    }
    if (this.flight.teams) {
      for (const team of this.flight.teams) {
        for (const golfer of team.golfers) {
          if (golfer.golfer_email) {
            emailList += golfer.golfer_email + ";"
          }
        }
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }

  // TODO: Move to admin view?
  // TODO: Conslidate with header onAddNewFlight
  onManageFlight(): void {
    const dialogRef = this.dialog.open(FlightCreateComponent, {
      width: '900px',
      data: this.flight as FlightCreate
    });

    dialogRef.afterClosed().subscribe(flightData => {
      if (flightData !== null && flightData !== undefined) {
        this.flightsService.updateFlight(flightData).subscribe(result => {
          console.log(`[FlightHomeComponent] Successfully updated flight: ${result.name} (${result.year})`);
          this.snackBar.open(`Successfully updated flight: ${result.name} (${result.year})`, undefined, {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          this.flightsService.getFlight(this.flight.id); // refresh flight data
        });
      }
    });
  }

}
