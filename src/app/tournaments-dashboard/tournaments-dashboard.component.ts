import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightsService } from '../flights/flights.service';
import { SeasonsService } from '../seasons/seasons.service';
import { TournamentInfo } from '../shared/tournament.model';
import { TournamentsService } from '../tournaments/tournaments.service';

@Component({
  selector: 'app-tournaments-dashboard',
  templateUrl: './tournaments-dashboard.component.html',
  styleUrls: ['./tournaments-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, DataViewModule, ProgressSpinnerModule],
  providers: [FlightsService],
})
export class TournamentsDashboardComponent implements OnInit, OnDestroy {
  isLoading = true;

  private currentYear: number | undefined;
  private seasonsSub: Subscription;
  private seasonsService = inject(SeasonsService);

  tournaments = signal<TournamentInfo[]>([]);
  private tournamentsSub: Subscription;
  private tournamentsService = inject(TournamentsService);

  ngOnInit(): void {
    this.tournamentsSub = this.tournamentsService
      .getTournamentsListUpdateListener()
      .subscribe((result) => {
        console.log(
          `[TournamentsDashboardComponent] Received list of ${result.numTournaments} tournaments`,
        );
        this.tournaments.set([...result.tournaments]);
        this.isLoading = false;
      });

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.currentYear = result.year;
      this.tournamentsService.getTournamentsList(this.currentYear);
    });
  }

  ngOnDestroy(): void {
    this.tournamentsSub.unsubscribe();
    this.seasonsSub.unsubscribe();
  }
}
