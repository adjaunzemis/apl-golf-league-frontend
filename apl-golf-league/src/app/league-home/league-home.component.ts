import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppConfigService } from '../app-config.service';
import { FlightInfo } from '../shared/flight.model';
import { FlightsService } from '../flights/flights.service';
import { TournamentInfo } from '../shared/tournament.model';
import { TournamentsService } from '../tournaments/tournaments.service';
import { Committee, Officer } from './../shared/officer.model';
import { OfficersService } from '../officers/officers.service';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css']
})
export class LeagueHomeComponent implements OnInit, OnDestroy {
  private currentYear: number;

  isLoadingFlights = true;
  currentFlights: FlightInfo[] = [];
  private flightsSub: Subscription;

  isLoadingTournaments = true;
  currentTournaments: TournamentInfo[] = [];
  private tournamentsSub: Subscription;

  isLoadingOfficers = true;
  officers: Officer[] = [];
  leagueOfficers: Officer[] = [];
  private officersSub: Subscription;

  constructor(private appConfigService: AppConfigService, private flightsService: FlightsService, private tournamentsService: TournamentsService, private officersService: OfficersService) { }

  ngOnInit(): void {
    this.currentYear = this.appConfigService.currentYear;

    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe(result => {
          console.log(`[LeagueHomeComponent] Received flights list`);
          this.currentFlights = result.flights;
          this.isLoadingFlights = false;
      });

    this.tournamentsSub = this.tournamentsService.getTournamentsListUpdateListener()
      .subscribe(result => {
        console.log(`[LeagueHomeComponent] Received tournaments list`);
        this.currentTournaments = result.tournaments.filter(tournament => tournament.year === this.currentYear);
        this.isLoadingTournaments = false;
      });

    this.officersSub = this.officersService.getOfficersListUpdateListener()
      .subscribe(result => {
        console.log(`[LeagueHomeComponent] Received officers list`);
        this.officers = result;
        this.leagueOfficers = result.filter((officer) => {
          return officer.committee.toString() === "LEAGUE";
        });
        this.isLoadingOfficers = false;
      })

    this.flightsService.getFlightsList(this.currentYear);
    this.tournamentsService.getTournamentsList(this.currentYear);
    this.officersService.getOfficersList(0, 100, this.currentYear); // TODO: Unhardcode query params
  }

  ngOnDestroy(): void {
      this.flightsSub.unsubscribe();
      this.tournamentsSub.unsubscribe();
      this.officersSub.unsubscribe();
  }

  getLeagueOfficersEmailList(): string {
    let emailList = "";
    for (const officer of this.leagueOfficers) {
      emailList += officer.email + ";"
    }
    return emailList.substring(0, emailList.length - 1);
  }

}
