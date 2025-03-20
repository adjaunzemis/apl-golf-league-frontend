import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';

import { FlightInfo } from 'src/app/shared/flight.model';
import { MatchSummary } from 'src/app/shared/match.model';
import { FlightScheduleWeeklyComponent } from './flight-schedule-weekly/flight-schedule-weekly.component';
import { FlightScheduleMatrixComponent } from './flight-schedule-matrix/flight-schedule-matrix.component';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  styleUrl: './flight-schedule.component.css',
  imports: [CardModule, FlightScheduleWeeklyComponent, FlightScheduleMatrixComponent, TabsModule],
})
export class FlightScheduleComponent implements OnInit {
  @Input() info: FlightInfo;
  @Input() matches: MatchSummary[];

  currentWeek = 1;

  ngOnInit(): void {
    this.currentWeek = this.getWeekForDate(new Date());
  }

  private getWeekForDate(date: Date): number {
    if (date < this.info.start_date) {
      return 1;
    } else {
      for (let week = this.info.weeks; week > 1; week--) {
        const weekStartDate = new Date(this.info.start_date);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        if (date >= weekStartDate) {
          return week;
        }
      }
    }
    return 1; // fall-through case, shouldn't be reachable
  }
}
