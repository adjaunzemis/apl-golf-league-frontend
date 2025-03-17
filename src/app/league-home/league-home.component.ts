import { Component } from '@angular/core';

import { FlightsDashboardComponent } from '../flights/flights-dashboard/flights-dashboard.component';
import { TournamentsDashboardComponent } from '../tournaments/tournaments-dashboard/tournaments-dashboard.component';
import { OfficersDashboardComponent } from '../officers/officers-dashboard/officers-dashboard.component';
import { RulesDashboardComponent } from '../rules-dashboard/rules-dashboard.component';
import { AnnouncementsDashboardComponent } from '../announcements-dashboard/announcements-dashboard.component';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css'],
  imports: [
    FlightsDashboardComponent,
    TournamentsDashboardComponent,
    OfficersDashboardComponent,
    RulesDashboardComponent,
    AnnouncementsDashboardComponent,
  ],
})
export class LeagueHomeComponent {}
