import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightsService } from '../flights.service';
import { FlightInfo } from '../../shared/flight.model';
import { SeasonsService } from '../../seasons/seasons.service';

@Component({
  selector: 'app-flights-dashboard',
  templateUrl: './flights-dashboard.component.html',
  styleUrls: ['./flights-dashboard.component.css'],
  imports: [CommonModule, RouterModule, CardModule, DataViewModule, ProgressSpinnerModule],
})
export class FlightsDashboardComponent implements OnInit, OnDestroy {
  isLoading = true;

  private currentYear: number | undefined;
  private seasonsSub: Subscription;
  private seasonsService = inject(SeasonsService);

  flights = signal<FlightInfo[]>([]);
  private flightsSub: Subscription;
  private flightsService = inject(FlightsService);

  ngOnInit(): void {
    this.flightsSub = this.flightsService.getListUpdateListener().subscribe((result) => {
      console.log(`[FlightsDashboardComponent] Received list of ${result.length} flights`);
      this.flights.set([...result]);
      this.isLoading = false;
    });

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.currentYear = result.year;
      this.flightsService.getList(this.currentYear);
    });
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
    this.seasonsSub.unsubscribe();
  }

  getSecretariesEmailList(): string {
    // TODO: Deduplicate emails
    let emailList = '';
    for (const flight of this.flights()) {
      if (flight.secretary_email) {
        emailList += flight.secretary_email + ';';
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }
}
