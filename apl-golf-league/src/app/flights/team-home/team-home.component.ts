import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TeamDataWithMatches } from '../../shared/team.model';
import { MatchData } from '../../shared/match.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrls: ['./team-home.component.css']
})
export class TeamHomeComponent implements OnInit, OnDestroy {
  isLoading = true;
  showScorecard = false;

  teamId: number;

  team: TeamDataWithMatches;
  teamSub: Subscription;

  focusedMatch: MatchData;

  constructor(private flightsService: FlightsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.teamSub = this.flightsService.getTeamUpdateListener()
      .subscribe((result: TeamDataWithMatches) => {
        console.log(`[TeamHomeComponent] Received team data`);
        this.isLoading = false;
        this.team = result;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.id) {
          console.log(`[TeamHomeComponent] Setting query parameter id=${params.id}`);
          this.teamId = params.id;
        }
      }
    });

    this.getTeamData();
  }

  ngOnDestroy(): void {
    this.teamSub.unsubscribe();
  }

  private getTeamData(): void {
    this.flightsService.getTeam(this.teamId);
  }

  focusMatch(match: MatchData) {
    if (this.showScorecard && this.focusedMatch === match) {
      this.showScorecard = false;
      return;
    }
    this.focusedMatch = match;
    this.showScorecard = true;
  }

}
