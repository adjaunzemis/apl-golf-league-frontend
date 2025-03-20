import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { FlightStandings } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-standings',
  templateUrl: './flight-standings.component.html',
  styleUrls: ['./flight-standings.component.css'],
  imports: [CommonModule, CardModule, TableModule],
})
export class FlightStandingsComponent {
  @Input() standings: FlightStandings;
}
