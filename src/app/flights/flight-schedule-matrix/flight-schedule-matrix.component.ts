import { Component, Input, OnInit } from '@angular/core';

import { FlightData } from '../../shared/flight.model';

@Component({
  selector: 'app-flight-schedule-matrix',
  templateUrl: './flight-schedule-matrix.component.html',
  styleUrls: ['./flight-schedule-matrix.component.css'],
  standalone: false,
})
export class FlightScheduleMatrixComponent implements OnInit {
  @Input() flight: FlightData;

  private currentDate = new Date(); // new Date("2022-04-28T00:00:00-04:00"); // <-- test value
  currentWeek: number = 1;

  teamNames: string[] = [];
  teamNumbers: { [name: string]: number } = {};
  teamOpponents: { [name: string]: string[] } = {};

  weeks: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.currentWeek = this.determineCurrentWeek();

    for (let week = 1; week <= this.flight.weeks; week++) {
      this.weeks.push(week);
    }

    if (this.flight.matches) {
      for (const match of this.flight.matches) {
        if (!Object.keys(this.teamNumbers).includes(match.home_team_name)) {
          this.teamNumbers[match.home_team_name] = Object.keys(this.teamNumbers).length + 1;
        }

        if (!Object.keys(this.teamNumbers).includes(match.away_team_name)) {
          this.teamNumbers[match.away_team_name] = Object.keys(this.teamNumbers).length + 1;
        }

        if (!Object.keys(this.teamOpponents).includes(match.home_team_name)) {
          this.teamOpponents[match.home_team_name] = Array(this.flight.weeks).fill('');
        }
        if (this.teamOpponents[match.home_team_name][match.week - 1] === '') {
          this.teamOpponents[match.home_team_name][match.week - 1] =
            '' + this.teamNumbers[match.away_team_name];
        } else {
          this.teamOpponents[match.home_team_name][match.week - 1] +=
            ' & ' + this.teamNumbers[match.away_team_name];
        }

        if (!Object.keys(this.teamOpponents).includes(match.away_team_name)) {
          this.teamOpponents[match.away_team_name] = Array(this.flight.weeks).fill('');
        }
        if (this.teamOpponents[match.away_team_name][match.week - 1] === '') {
          this.teamOpponents[match.away_team_name][match.week - 1] =
            '' + this.teamNumbers[match.home_team_name];
        } else {
          this.teamOpponents[match.away_team_name][match.week - 1] +=
            ' & ' + this.teamNumbers[match.home_team_name];
        }
      }
    }
    this.teamNames = Object.keys(this.teamNumbers);
  }

  private determineCurrentWeek(): number {
    if (this.currentDate < this.flight.start_date) {
      return 1;
    } else {
      for (let week = this.flight.weeks; week > 1; week--) {
        let weekStartDate = new Date(this.flight.start_date);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        if (this.currentDate >= weekStartDate) {
          return week;
        }
      }
    }
    return 1; // fall-through case, shouldn't be reachable
  }
}
