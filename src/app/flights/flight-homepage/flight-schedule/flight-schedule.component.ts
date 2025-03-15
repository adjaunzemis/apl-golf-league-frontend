import { Component, Input } from '@angular/core';
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
export class FlightScheduleComponent {
  @Input() info: FlightInfo;
  @Input() matches: MatchSummary[];
}
