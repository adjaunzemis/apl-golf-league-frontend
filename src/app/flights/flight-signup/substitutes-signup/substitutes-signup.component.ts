import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';

import { FlightDivision, FlightTeamGolfer } from 'src/app/shared/flight.model';
import { Golfer } from 'src/app/shared/golfer.model';

@Component({
  selector: 'app-substitutes-signup',
  templateUrl: './substitutes-signup.component.html',
  styleUrl: './substitutes-signup.component.css',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    ButtonModule,
    TableModule,
    AccordionModule,
  ],
})
export class SubstitutesSignupComponent implements OnChanges {
  @Output() refreshTeamsForFlight = new EventEmitter<number>();

  @Input() substitutes: FlightTeamGolfer[];

  @Input() golferOptions: Golfer[];

  @Input() flightId: number;
  @Input() divisionOptions: FlightDivision[];

  newGolfer: Golfer | null = null;
  newGolferDivision: FlightDivision | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['golferOptions'] || changes['flightId'] || changes['divisionOptions']) {
      // this.clearNewSubstitute();
    }
  }

  addGolfer(): void {
    if (!this.newGolfer || !this.newGolferDivision) {
      return;
    }

    // TODO: Send HTTP request

    // this.clearNewSubstitute();
  }

  removeGolfer(golfer: FlightTeamGolfer): void {
    this.substitutes = this.substitutes.filter(
      (substitute) => substitute.golfer_id !== golfer.golfer_id,
    );

    // TODO: Send HTTP request
  }
}
