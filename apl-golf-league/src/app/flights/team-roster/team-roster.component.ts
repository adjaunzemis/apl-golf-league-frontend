import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { TeamData, TeamDataWithMatches } from '../../shared/team.model';
import { TeamGolferData } from '../../shared/golfer.model';

@Component({
  selector: 'app-team-roster',
  templateUrl: './team-roster.component.html',
  styleUrls: ['./team-roster.component.css']
})
export class TeamRosterComponent implements OnInit {

  @Input() team : TeamDataWithMatches;

  playersData = new MatTableDataSource<TeamGolferData>();

  columnsToDisplay = ['name', 'role', 'division'];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.playersData = new MatTableDataSource<TeamGolferData>(this.team.golfers);
  }

  selectPlayer(player: TeamGolferData): void {
    this.router.navigate(['/golfers'], { queryParams: { id: player.golfer_id } });
  }
}
