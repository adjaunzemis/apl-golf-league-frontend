import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatchData } from 'src/app/shared/match.model';

import { FlightData } from '../../shared/flight.model';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  styleUrls: ['./flight-schedule.component.css']
})
export class FlightScheduleComponent implements OnInit {
  @Input() flight: FlightData;

  private currentDate = new Date(); // new Date("2022-04-28T00:00:00-04:00"); // <-- test value
  selectedWeek: number = 1;
  weekOptions: string[] = [];

  selectedWeekMatches: MatchData[] = [];

  ngOnInit(): void {
    this.setWeekOptions();
    this.selectedWeek = this.determineCurrentWeek();
  }

  onSelectedWeekChanged(selectedWeekChange: MatSelectChange) {
    this.selectedWeek = parseInt((selectedWeekChange.value as string).split(' ')[0]);
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

  private setWeekOptions(): void {
    for (let week = 1; week <= this.flight.weeks; week++) {
      let weekStartDate = new Date(this.flight.start_date);
      weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
      let nextWeekStartDate = new Date(weekStartDate);
      nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 6);
      this.weekOptions.push(week + ": " + weekStartDate.toLocaleString('default', { month: 'short' }) + " " + weekStartDate.getDate() + " - " + nextWeekStartDate.toLocaleString('default', { month: 'short' }) + " " + nextWeekStartDate.getDate());
    }
  }

}
