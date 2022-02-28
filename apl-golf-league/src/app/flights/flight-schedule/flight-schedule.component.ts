import { Component, Input, OnInit } from '@angular/core';

import { FlightData } from '../../shared/flight.model';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  styleUrls: ['./flight-schedule.component.css']
})
export class FlightScheduleComponent implements OnInit {
  @Input() flight: FlightData;

  private currentDate = new Date(); // new Date("2022-04-28T00:00:00-04:00"); // <-- test value
  currentWeek: number = 1;
  weekOptions: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.setWeekOptions();
    this.currentWeek = this.determineCurrentWeek();
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
    this.weekOptions = Array.from({length: this.flight.weeks}, (_, i) => i + 1);
  }

}
