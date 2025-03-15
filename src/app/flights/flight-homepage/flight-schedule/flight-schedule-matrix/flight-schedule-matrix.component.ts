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

  private currentDate = new Date(); // new Date("2022-04-28T00:00:00-04:00"); // <-- test value
  currentWeek = 1;

  teamNames: string[] = [];
  teamNumbers: Record<string, number> = {};
  teamOpponents: Record<string, string[]> = {};

  weeks: number[] = [];

  ngOnInit(): void {
    for (let week = 1; week <= this.info.weeks; week++) {
      this.weeks.push(week);
    }
    this.currentWeek = this.determineCurrentWeek();

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

  private determineCurrentWeek(): number {
    if (this.currentDate < this.info.start_date) {
      return 1;
    } else {
      for (let week = this.info.weeks; week > 1; week--) {
        const weekStartDate = new Date(this.info.start_date);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        if (this.currentDate >= weekStartDate) {
          return week;
        }
      }
    }
    return 1; // fall-through case, shouldn't be reachable
  }
}
