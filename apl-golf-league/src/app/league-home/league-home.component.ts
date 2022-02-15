import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FlightInfo } from '../shared/flight.model';
import { TournamentInfo } from '../shared/tournament.model';
import { FlightsService } from '../flights/flights.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { Committee, MOCK_OFFICERS, Officer } from './../shared/officer.model';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css']
})
export class LeagueHomeComponent implements OnInit, OnDestroy {
  private currentYear: number = 2021;

  isLoadingFlights = true;
  flights: FlightInfo[] = [];
  currentFlights: FlightInfo[] = [];
  private flightsSub: Subscription;

  isLoadingTournaments = true;
  tournaments: TournamentInfo[] = [];
  currentTournaments: TournamentInfo[] = [];
  private tournamentsSub: Subscription;

  // TODO: Replace placeholder officer info with database query
  leagueOfficers: Officer[] = MOCK_OFFICERS.filter((officer) => {
    return officer.committee === Committee.LEAGUE;
  });

  constructor(private flightsService: FlightsService, private tournamentsService: TournamentsService) { }

  ngOnInit(): void {
    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
          console.log(`[LeagueHomeComponent] Received flights list`);
          this.flights = result.flights;
          this.currentFlights = [];
          for (let flight of this.flights) {
            if (flight.year === this.currentYear) {
              this.currentFlights.push(flight);
            }
          }
          this.isLoadingFlights = false;
      });

    this.tournamentsSub = this.tournamentsService.getTournamentsListUpdateListener()
      .subscribe(result => {
        console.log(`[LeagueHomeComponent] Received tournaments list`);
        this.tournaments = result.tournaments;
        this.currentTournaments = [];
        for (let tournament of this.tournaments) {
          if (tournament.year === this.currentYear) {
            this.currentTournaments.push(tournament);
          }
        }
        this.isLoadingTournaments = false;
      });

    this.flightsService.getFlightsList(0, 100);
    this.tournamentsService.getTournamentsList(0, 100);
  }

  ngOnDestroy(): void {
      this.flightsSub.unsubscribe();
      this.tournamentsSub.unsubscribe
  }

  getLeagueOfficersEmailList(): string {
    let emailList = "";
    for (const officer of this.leagueOfficers) {
      emailList += officer.email + ";"
    }
    return emailList.substring(0, emailList.length - 1);
  }

}
