import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FlightInfo } from '../shared/flight.model';
import { TournamentInfo } from '../shared/tournament.model';
import { FlightsService } from '../flights/flights.service';
import { TournamentsService } from '../tournaments/tournaments.service';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css']
})
export class LeagueHomeComponent implements OnInit, OnDestroy {
  isLoadingFlights = true;
  flights: FlightInfo[] = [];
  private flightsSub: Subscription;

  isLoadingTournaments = true;
  tournaments: TournamentInfo[] = [];
  private tournamentsSub: Subscription;

  // TODO: Replace placeholder officer info with database query
  officers: OfficerInfo[] = [
    { name: "John Landshof", title: "President", email: "#" },
    { name: "Richie Steinwand", title: "Vice-President", email: "#" },
    { name: "Bob Erlandson", title: "Treasurer", email: "#" },
    { name: "Andris Jaunzemis", title: "Handicapper", email: "#" }
  ]

  constructor(private flightsService: FlightsService, private tournamentsService: TournamentsService) { }

  ngOnInit(): void {
    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
          console.log(`[LeagueHomeComponent] Received flights list`);
          this.flights = result.flights;
          this.isLoadingFlights = false;
      });

    this.tournamentsSub = this.tournamentsService.getTournamentsListUpdateListener()
      .subscribe(result => {
        console.log(`[LeagueHomeComponent] Received tournaments list`);
        this.tournaments = result.tournaments;
        this.isLoadingTournaments = false;
      });

    this.flightsService.getFlightsList(0, 100);
    this.tournamentsService.getTournamentsList(0, 100);
  }

  ngOnDestroy(): void {
      this.flightsSub.unsubscribe();
      this.tournamentsSub.unsubscribe
  }

}

interface OfficerInfo {
  name: string
  title: string
  email: string
}
