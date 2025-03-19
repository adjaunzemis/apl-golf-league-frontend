import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';

import { FlightStatistics } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-statistics',
  templateUrl: './flight-statistics.component.html',
  styleUrls: ['./flight-statistics.component.css'],
  imports: [CommonModule, FormsModule, CardModule, TableModule, ToggleButtonModule],
})
export class FlightStatisticsComponent {
  @Input() statistics: FlightStatistics;

  scoringMode = "gross";

  onChangeScoringMode(event: ToggleButtonChangeEvent): void {
    if (event.checked) {
      this.scoringMode = "net";
    } else {
      this.scoringMode = "gross";
    }
  }
}
