import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { FlightStatistics } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-statistics',
  templateUrl: './flight-statistics.component.html',
  styleUrls: ['./flight-statistics.component.css'],
  imports: [CommonModule, CardModule, TableModule],
})
export class FlightStatisticsComponent {
  @Input() statistics: FlightStatistics;
}
