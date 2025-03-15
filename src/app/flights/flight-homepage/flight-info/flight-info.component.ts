import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { FlightInfo } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-info',
  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.css',
  imports: [CommonModule, CardModule],
})
export class FlightInfoComponent {
  @Input() info: FlightInfo;

  getAddressLine1(): string {
    if (!this.info.address) {
      return '';
    }
    return this.info.address.split(',')[0];
  }

  getAddressLine2(): string {
    if (!this.info.address) {
      return '';
    }
    return this.info.address.split(',').slice(1).join(', ');
  }
}
