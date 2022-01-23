import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { TeamDataWithMatches } from '../../shared/team.model';
import { GolferStatistics } from '../../shared/golfer.model';

@Component({
  selector: 'app-team-statistics',
  templateUrl: './team-statistics.component.html',
  styleUrls: ['./team-statistics.component.css']
})
export class TeamStatisticsComponent implements OnInit {

  @Input() team: TeamDataWithMatches;

  statsData = new MatTableDataSource<GolferStatistics>();

  columnsToDisplay = ['golfer_name', 'num_rounds', 'avg_gross_score', 'avg_net_score', 'num_holes', 'num_eagles', 'num_birdies', 'num_pars', 'num_bogeys', 'num_double_bogeys', 'num_others']

  constructor() { }

  ngOnInit(): void {
  }

}
