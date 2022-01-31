import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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
    // TODO: make FlightInfo-specific route
    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
          console.log(`[LeagueHomeComponent] Received flights list`);
          for (let flight of result.flights) {
            this.flights.push({
              id: flight.flight_id,
              name: flight.name,
              year: flight.year,
              logo_url: flight.logo_url
            });
          }
          this.isLoadingFlights = false;
      });

    // TODO: make TournamentInfo-specific route
    this.tournamentsSub = this.tournamentsService.getTournamentsListUpdateListener()
      .subscribe(result => {
        console.log(`[LeagueHomeComponent] Received tournaments list`);
        for (let tournament of result.tournaments) {
          this.tournaments.push({
            id: tournament.tournament_id,
            name: tournament.name,
            year: tournament.year,
            course: tournament.course_name,
            logo_url: tournament.logo_url
          });
          this.isLoadingTournaments = false;
        }
      });
      
    this.flightsService.getFlightsList(0, 100);
    this.tournamentsService.getTournamentsList(0, 100);
  }

  ngOnDestroy(): void {
      this.flightsSub.unsubscribe();
      this.tournamentsSub.unsubscribe
  }

}

interface FlightInfo {
  id: number
  name: string
  year: number
  logo_url?: string
}

interface TournamentInfo {
  id: number
  name: string
  year: number
  course: string
  logo_url?: string
}

interface OfficerInfo {
  name: string
  title: string
  email: string
}
