import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { FlightDivision } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-divisions',
  templateUrl: './flight-divisions.component.html',
  styleUrl: './flight-divisions.component.css',
  imports: [CommonModule, CardModule, TableModule],
})
export class FlightDivisionsComponent {
  @Input() divisions: FlightDivision[];
}
