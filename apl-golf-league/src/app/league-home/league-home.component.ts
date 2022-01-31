import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FlightsService } from '../flights/flights.service';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css']
})
export class LeagueHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  flights: FlightInfo[] = [];
  private flightsSub: Subscription;

  // TODO: Replace placeholder tournament info with database query
  tournaments: TournamentInfo[] = [
    { id: 1, name: "Maryland National", year: 2021, logo_url: "", course: "Maryland National GC"},
    { id: 2, name: "Lake Presidential", year: 2021, logo_url: "", course: "Lake Presidential GC"},
    { id: 3, name: "Down in the Valley", year: 2021, logo_url: "", course: "Turf Valley GC"},
    { id: 4, name: "Grab Your Guns", year: 2021, logo_url: "", course: "Musket Ridge GC"},
    { id: 5, name: "Ryder Cup", year: 2021, logo_url: "", course: "South Hills GC"},
    { id: 6, name: "Banquet Tournament", year: 2021, logo_url: "", course: "Woodlands GC"}
  ];

  // TODO: Replace placeholder officer info with database query
  officers: OfficerInfo[] = [
    { name: "John Landshof", title: "President", email: "#" },
    { name: "Richie Steinwand", title: "Vice-President", email: "#" },
    { name: "Bob Erlandson", title: "Treasurer", email: "#" },
    { name: "Andris Jaunzemis", title: "Handicapper", email: "#" }
  ]

  constructor(private flightsService: FlightsService) { }

  ngOnInit(): void {
    // TODO: make FlightInfo-specific route
    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
          console.log(`[LeagueHomeComponent] Received flight list`);
          for (let flight of result.flights) {
            this.flights.push({
              id: flight.flight_id,
              name: flight.name,
              year: flight.year,
              logo_url: flight.logo_url
            })
          }
          this.isLoading = false;
      });
    this.flightsService.getFlightsList(0, 100);
  }

  ngOnDestroy(): void {
      this.flightsSub.unsubscribe();
  }

}

interface FlightInfo {
  id: number
  name: string
  year: number
  logo_url: string
}

interface TournamentInfo {
  id: number
  name: string
  year: number
  course: string
  logo_url: string
}

interface OfficerInfo {
  name: string
  title: string
  email: string
}
