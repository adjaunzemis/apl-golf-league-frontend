import { Component, Input, OnInit } from '@angular/core';

import { FlightScheduleWeeklyComponent } from '../../flight-home/flight-schedule/flight-schedule-weekly/flight-schedule-weekly.component';
import { MatchSummary } from 'src/app/shared/match.model';

import { CardModule } from 'primeng/card';
import { FlightInfo } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-team-schedule',
  templateUrl: './team-schedule.component.html',
  styleUrl: './team-schedule.component.css',
  imports: [CardModule, FlightScheduleWeeklyComponent],
})
export class TeamScheduleComponent implements OnInit {
  @Input() flightInfo!: FlightInfo;
  @Input() matches!: MatchSummary[];

  currentWeek = 1;

  ngOnInit(): void {
    this.currentWeek = this.getWeekForDate(new Date());
  }

  private getWeekForDate(date: Date): number {
    if (date < this.flightInfo.start_date) {
      return 1;
    } else {
      for (let week = this.flightInfo.weeks; week > 1; week--) {
        const weekStartDate = new Date(this.flightInfo.start_date);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        if (date >= weekStartDate) {
          return week;
        }
      }
    }
    return 1; // fall-through case, shouldn't be reachable
  }
}
