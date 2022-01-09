import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { TeamData } from '../../shared/team.model';
import { PlayerStatistics } from '../../shared/player-statistics.model';

@Component({
  selector: 'app-team-statistics',
  templateUrl: './team-statistics.component.html',
  styleUrls: ['./team-statistics.component.css']
})
export class TeamStatisticsComponent implements OnInit {

  @Input() team: TeamData;

  statsData = new MatTableDataSource<PlayerStatistics>();

  columnsToDisplay = ['golfer_name', '_num_rounds', 'num_holes', 'avg_gross_score', 'avg_net_score', 'num_eagles', 'num_birdies', 'pars', 'num_bogeys', 'num_double_bogeys', 'num_others', 'num_points', 'avg_points']

  constructor() { }

  ngOnInit(): void {
  }

}
