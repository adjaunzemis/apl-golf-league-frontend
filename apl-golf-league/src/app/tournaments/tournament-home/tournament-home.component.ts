import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TournamentsService } from '../tournaments.service';
import { TournamentData } from '../../shared/tournament.model';
import { RoundData } from '../../shared/round.model';
import { TournamentTeamData } from '../../shared/team.model';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.css']
})
export class TournamentHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  showScorecard = false;

  tournament: TournamentData;
  private tournamentSub: Subscription;

  rounds: RoundData[] = [];

  focusedTeam: TournamentTeamData;

  constructor(private tournamentsService: TournamentsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.tournamentSub = this.tournamentsService.getTournamentUpdateListener()
      .subscribe(tournamentData => {
          console.log(`[TournamentHomeComponent] Received data for tournament: name=${tournamentData.name}, year=${tournamentData.year}, id=${tournamentData.id}`);
          this.tournament = tournamentData;
          this.compileRoundData();
          this.isLoading = false;
          console.log(tournamentData);
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
          if (params.id) {
              console.log("[TournamentHomeComponent] Processing route with query parameter: id=" + params.id);
              this.tournamentsService.getTournament(params.id);
          }
      }
    });
  }

  ngOnDestroy(): void {
    this.tournamentSub.unsubscribe();
  }

  focusTeam(team: TournamentTeamData): void {
    if (this.showScorecard && this.focusedTeam === team) {
      this.showScorecard = false;
      return;
    }
    this.focusedTeam = team;
    this.showScorecard = true;
  }

  private compileRoundData(): void {
    for (let team of this.tournament.teams) {
      if (team.rounds) {
        for (let round of team.rounds) {
          this.rounds.push(round);
        }
      }
    }
  }

  private combineRoundHoleResults(): void {

  }

}
