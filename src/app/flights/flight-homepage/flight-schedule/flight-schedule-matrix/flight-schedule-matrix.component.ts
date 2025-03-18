import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { MatchSummary } from 'src/app/shared/match.model';
import { FlightInfo } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-schedule-matrix',
  templateUrl: './flight-schedule-matrix.component.html',
  styleUrls: ['./flight-schedule-matrix.component.css'],
  imports: [CommonModule, CardModule],
})
export class FlightScheduleMatrixComponent implements OnInit {
  @Input() info: FlightInfo;
  @Input() matches: MatchSummary[];
  @Input() currentWeek: number;

  teamNames: string[] = [];
  teamNumbers: Record<string, number> = {};
  teamOpponents: Record<string, string[]> = {};

  weeks: number[] = [];

  ngOnInit(): void {
    for (let week = 1; week <= this.info.weeks; week++) {
      this.weeks.push(week);
    }

    this.teamNames = [];
    this.teamNumbers = {};
    this.teamOpponents = {};

    for (const match of this.matches) {
      if (!Object.keys(this.teamNumbers).includes(match.home_team_name)) {
        this.teamNumbers[match.home_team_name] = Object.keys(this.teamNumbers).length + 1;
      }

      if (!Object.keys(this.teamNumbers).includes(match.away_team_name)) {
        this.teamNumbers[match.away_team_name] = Object.keys(this.teamNumbers).length + 1;
      }

      if (!Object.keys(this.teamOpponents).includes(match.home_team_name)) {
        this.teamOpponents[match.home_team_name] = Array(this.info.weeks).fill('');
      }
      if (this.teamOpponents[match.home_team_name][match.week - 1] === '') {
        this.teamOpponents[match.home_team_name][match.week - 1] =
          '' + this.teamNumbers[match.away_team_name];
      } else {
        this.teamOpponents[match.home_team_name][match.week - 1] +=
          ' & ' + this.teamNumbers[match.away_team_name];
      }

      if (!Object.keys(this.teamOpponents).includes(match.away_team_name)) {
        this.teamOpponents[match.away_team_name] = Array(this.info.weeks).fill('');
      }
      if (this.teamOpponents[match.away_team_name][match.week - 1] === '') {
        this.teamOpponents[match.away_team_name][match.week - 1] =
          '' + this.teamNumbers[match.home_team_name];
      } else {
        this.teamOpponents[match.away_team_name][match.week - 1] +=
          ' & ' + this.teamNumbers[match.home_team_name];
      }
    }

    this.teamNames = Object.keys(this.teamNumbers);
  }

  getWeekStartDate(week: number): string {
    const d = new Date(this.info.start_date);
    d.setDate(d.getDate() + 7 * (week - 1));
    return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
  }
}
