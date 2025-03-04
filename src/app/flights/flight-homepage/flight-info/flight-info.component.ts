import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { FlightData } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-info',
  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.css',
  imports: [CommonModule, CardModule],
})
export class FlightInfoComponent {
  @Input() flight: FlightData;
}
