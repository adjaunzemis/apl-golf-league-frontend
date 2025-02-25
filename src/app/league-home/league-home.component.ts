import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

import { FlightsDashboardComponent } from '../flights-dashboard/flights-dashboard.component';
import { TournamentsDashboardComponent } from '../tournaments-dashboard/tournaments-dashboard.component';
import { OfficersDashboardComponent } from '../officers/officers-dashboard/officers-dashboard.component';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css'],
  imports: [
    CardModule,
    FlightsDashboardComponent,
    TournamentsDashboardComponent,
    OfficersDashboardComponent,
  ],
})
export class LeagueHomeComponent {}
