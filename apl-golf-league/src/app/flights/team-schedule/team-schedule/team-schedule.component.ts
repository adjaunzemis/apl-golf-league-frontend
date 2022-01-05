import { Component, Input, OnInit } from '@angular/core';

import { TeamData } from '../../../shared/team.model';

@Component({
  selector: 'app-team-schedule',
  templateUrl: './team-schedule.component.html',
  styleUrls: ['./team-schedule.component.css']
})
export class TeamScheduleComponent implements OnInit {

  @Input() team : TeamData;

  constructor() { }

  ngOnInit(): void {

  }

}
