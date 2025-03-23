import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { TournamentInfo } from '../../shared/tournament.model';
import { TournamentsService } from '../tournaments.service';
import { Season } from 'src/app/shared/season.model';

@Component({
  selector: 'app-tournaments-dashboard',
  templateUrl: './tournaments-dashboard.component.html',
  styleUrls: ['./tournaments-dashboard.component.css'],
  imports: [CommonModule, RouterModule, CardModule, DataViewModule, ProgressSpinnerModule],
})
export class TournamentsDashboardComponent implements OnInit, OnDestroy, OnChanges {
  isLoading = true;

  @Input() season!: Season;

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
  }

  ngOnDestroy(): void {
    this.tournamentsSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['season'] && this.season) {
      this.tournamentsService.getTournamentsList(this.season.year);
    }
  }

  getName(tournament: TournamentInfo): string {
    let name = tournament.name;
    if (!this.season.is_active) {
      name += ` (${tournament.year})`;
    }
    return name;
  }

  getOrganizersEmailList(): string {
    // TODO: Deduplicate emails
    let emailList = '';
    for (const tournament of this.tournaments()) {
      if (tournament.secretary_email) {
        emailList += tournament.secretary_email + ';';
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }
}
