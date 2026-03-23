import {
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

import { FlightsService } from '../flights.service';
import { FlightInfo } from '../../shared/flight.model';
import { Season } from 'src/app/shared/season.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-flights-dashboard',
  templateUrl: './flights-dashboard.component.html',
  styleUrls: ['./flights-dashboard.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    DataViewModule,
    ProgressSpinnerModule,
    ButtonModule,
  ],
})
export class FlightsDashboardComponent implements OnInit, OnDestroy, OnChanges {
  isLoading = true;

  @Input() season!: Season;

  flights = signal<FlightInfo[]>([]);
  private flightsSub: Subscription;
  private flightsService = inject(FlightsService);
  private authService = inject(AuthService);

  user = signal(this.authService.user.value);
  canEdit = computed(() => {
    const u = this.user();
    return u?.is_admin || u?.edit_flights;
  });

  ngOnInit(): void {
    this.flightsSub = this.flightsService.getListUpdateListener().subscribe((result) => {
      console.log(`[FlightsDashboardComponent] Received list of ${result.length} flights`);
      this.flights.set([...result]);
      this.isLoading = false;
    });

    this.authService.user.subscribe((u) => {
      this.user.set(u);
    });
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['season'] && this.season) {
      this.isLoading = true;
      this.flightsService.getList(this.season.year);
    }
  }

  getName(flight: FlightInfo) {
    let name = flight.name;
    if (!this.season.is_active) {
      name += ` (${flight.year})`;
    }
    return name;
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
