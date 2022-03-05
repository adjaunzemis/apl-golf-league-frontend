import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TournamentsService } from '../tournaments.service';
import { TournamentInfo } from '../../shared/tournament.model';

@Component({
  selector: 'app-tournament-history',
  templateUrl: './tournament-history.component.html',
  styleUrls: ['./tournament-history.component.css']
})
export class TournamentHistoryComponent implements OnInit, OnDestroy {
  isLoading = true;
  tournaments: TournamentInfo[] = [];
  private tournamentsSub: Subscription;

  tournamentsSortedByYear: { [year: number]: TournamentInfo[] };
  sortedYears: number[];

  constructor(private tournamentsService: TournamentsService) { }

  ngOnInit(): void {
    this.tournamentsSub = this.tournamentsService.getTournamentsListUpdateListener()
      .subscribe(result => {
          console.log(`[LeagueHomeComponent] Received flights list`);
          this.tournaments = result.tournaments;
          this.sortTournamentsByYear();
          this.isLoading = false;
      });

    this.tournamentsService.getTournamentsList();
  }

  ngOnDestroy(): void {
      this.tournamentsSub.unsubscribe()
  }

  private sortTournamentsByYear(): void {
    this.sortedYears = []
    this.tournamentsSortedByYear = {};
    for (let tournament of this.tournaments) {
      if (!this.tournamentsSortedByYear[tournament.year]) {
        this.sortedYears.push(tournament.year);
        this.tournamentsSortedByYear[tournament.year] = [];
      }
      this.tournamentsSortedByYear[tournament.year].push(tournament);
    }

    this.sortedYears.sort((a, b) => b - a);
  }

  getTournamentsForYear(year: number): TournamentInfo[] {
    return this.tournamentsSortedByYear[year];
  }

}
