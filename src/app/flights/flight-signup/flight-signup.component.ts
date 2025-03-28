import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightsService } from '../flights.service';
import { FlightInfo } from 'src/app/shared/flight.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { Season } from 'src/app/shared/season.model';
import { TeamCreateComponent } from 'src/app/teams/team-create/team-create.component';
import { FlightInfoComponent } from '../flight-home/flight-info/flight-info.component';

@Component({
  selector: 'app-flight-signup',
  templateUrl: './flight-signup.component.html',
  styleUrl: './flight-signup.component.css',
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, DataViewModule, ProgressSpinnerModule, FlightInfoComponent, TeamCreateComponent],
})
export class FlightSignupComponent implements OnInit, OnDestroy {
  isLoading = true;

  flights!: FlightInfo[];

  private infoSub: Subscription;
  private flightsService = inject(FlightsService);

  selectedFlight: FlightInfo | null = null;

  season!: Season;

  private activeSeasonSub: Subscription;
  private seasonsService = inject(SeasonsService);

  ngOnInit(): void {
    this.infoSub = this.flightsService.getListUpdateListener().subscribe((result) => {
      this.flights = [...result];
      this.isLoading = false;
    });

    this.activeSeasonSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.season = result;
      this.flightsService.getList(result.year);
    });

    this.seasonsService.getActiveSeason();
  }

  ngOnDestroy(): void {
    this.infoSub.unsubscribe();
    this.activeSeasonSub.unsubscribe();
  }

  getEarliestSignupDate(): Date {
    let d = this.flights[0].signup_start_date;
    for (const f of this.flights) {
      if (f.signup_start_date < d) {
        d = f.signup_start_date;
      }
    }
    return d;
  }

  selectFlight(info: FlightInfo): void {
    this.selectedFlight = info;
  }
}
