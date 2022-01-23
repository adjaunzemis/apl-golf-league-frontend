import { Component, Input } from '@angular/core';

import { TeamDataWithMatches } from '../../shared/team.model';

@Component({
  selector: 'app-team-schedule',
  templateUrl: './team-schedule.component.html',
  styleUrls: ['./team-schedule.component.css']
})
export class TeamScheduleComponent {

  @Input() team : TeamDataWithMatches;

  constructor() { }

}
