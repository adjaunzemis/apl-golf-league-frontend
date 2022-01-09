import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { TeamData } from '../../shared/team.model';
import { PlayerData } from '../../shared/player.model';

@Component({
  selector: 'app-team-roster',
  templateUrl: './team-roster.component.html',
  styleUrls: ['./team-roster.component.css']
})
export class TeamRosterComponent implements OnInit {

  @Input() team : TeamData;
  
  playersData = new MatTableDataSource<PlayerData>();

  columnsToDisplay = ['name', 'role', 'division'];
  
  constructor() { }

  ngOnInit(): void {
    this.playersData = new MatTableDataSource<PlayerData>(this.team.players);
  }
}
