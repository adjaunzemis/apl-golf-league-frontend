import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TeamData } from '../../shared/team.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrls: ['./team-home.component.css']
})
export class TeamHomeComponent implements OnInit, OnDestroy {
  isLoading = false;

  teamId: number;

  team: TeamData;
  teamSub: Subscription;

  constructor(private flightsService: FlightsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.teamSub = this.flightsService.getTeamUpdateListener()
      .subscribe((result: TeamData) => {
        console.log(`[TeamHomeComponent] Received team data`);
        this.isLoading = false;
        this.team = result;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.id) {
          console.log("[TeamHomeComponent] Setting query parameter id=" + params.id);
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
}
