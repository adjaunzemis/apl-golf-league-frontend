import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

import { FlightTeam } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-teams',
  templateUrl: './flight-teams.component.html',
  styleUrl: './flight-teams.component.css',
  imports: [CommonModule, CardModule, AccordionModule, TableModule],
})
export class FlightTeamsComponent {
  @Input() teams: FlightTeam[];
}
