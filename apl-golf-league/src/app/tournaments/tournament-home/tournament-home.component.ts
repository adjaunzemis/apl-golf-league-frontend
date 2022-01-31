import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TournamentData } from '../../shared/tournament.model';
import { TournamentsService } from '../tournaments.service';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.css']
})
export class TournamentHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  tournament: TournamentData;
  private tournamentSub: Subscription;

  constructor(private tournamentsService: TournamentsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.tournamentSub = this.tournamentsService.getTournamentUpdateListener()
      .subscribe(tournamentData => {
          console.log(`[TournamentHomeComponent] Received data for tournament: name=${tournamentData.name}, year=${tournamentData.year}, id=${tournamentData.tournament_id}`);
          this.tournament = tournamentData;
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

}
