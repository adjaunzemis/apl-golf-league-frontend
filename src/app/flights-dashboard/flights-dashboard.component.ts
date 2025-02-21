import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightsService } from '../flights/flights.service';
import { FlightInfo } from '../shared/flight.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-flights-dashboard',
    templateUrl: './flights-dashboard.component.html',
    styleUrls: ['./flights-dashboard.component.css'],
    standalone: true,
    imports: [CommonModule, CardModule, DataViewModule, ProgressSpinnerModule],
    providers: [FlightsService]
})
export class FlightsDashboardComponent implements OnInit, OnDestroy {

    isLoading = true;
    flights = signal<FlightInfo[]>([]);
    private flightsSub: Subscription;

    private flightsService = inject(FlightsService);

    ngOnInit(): void {
        this.flightsSub = this.flightsService.getFlightsListUpdateListener().subscribe((result) => {
            console.log(`[FlightsDashboardComponent] Received list of ${result.numFlights} flights`);
            this.flights.set([...result.flights]);
            this.isLoading = false;
        });
        this.flightsService.getFlightsList();
    }

    ngOnDestroy(): void {
        this.flightsSub.unsubscribe();
    }
}
