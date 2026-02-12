import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';

import { FlightDivision, FlightGolfer } from 'src/app/shared/flight.model';
import { Golfer } from 'src/app/shared/golfer.model';
import { TeamsService } from 'src/app/teams/teams.service';
import { Substitute } from 'src/app/shared/substitute.model';
import { NotificationService } from 'src/app/notifications/notification.service';

@Component({
  selector: 'app-substitutes-signup',
  templateUrl: './substitutes-signup.component.html',
  styleUrl: './substitutes-signup.component.css',
  imports: [
    FormsModule,
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    ButtonModule,
    TableModule,
    AccordionModule
],
})
export class SubstitutesSignupComponent implements OnInit, OnChanges {
  @Output() refreshTeamsForFlight = new EventEmitter<number>();

  @Input() allowDelete = false;

  @Input() substitutes: FlightGolfer[];

  @Input() golferOptions: Golfer[];

  @Input() flightId: number;
  @Input() divisionOptions: FlightDivision[];
  private divisionNameToId: Record<string, number> = {};

  newGolfer: Golfer | null = null;
  newGolferDivision: FlightDivision | null = null;

  private teamsService = inject(TeamsService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.updateDivisionIdMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['golferOptions'] || changes['flightId']) {
      this.clearNewSubstitute();
    }

    if (changes['divisionOptions']) {
      this.clearNewSubstitute();
      this.updateDivisionIdMap();
    }
  }

  private updateDivisionIdMap(): void {
    this.divisionNameToId = {};
    for (const d of this.divisionOptions) {
      this.divisionNameToId[d.name] = d.id;
    }
  }

  addGolfer(): void {
    if (!this.newGolfer || !this.newGolferDivision) {
      return;
    }

    const substitute: Substitute = {
      flight_id: this.flightId,
      golfer_id: this.newGolfer.id,
      division_id: this.newGolferDivision.id,
    };

    this.teamsService.addSubstitute(substitute).subscribe(
      () => {
        console.log(
          `[SubstitutesSignupComponent] Added substitute '${this.newGolfer?.name}' to flight id=${this.flightId}`,
        );
        this.notificationService.showSuccess(
          'Substitute Added',
          `Successfully added substitute '${this.newGolfer?.name}'`,
          5000,
        );

        this.refreshTeamsForFlight.emit(this.flightId);

        this.clearNewSubstitute();
      },
      () => {
        console.error(
          `[SubstitutesSignupComponent] Unable to add substitute '${this.newGolfer?.name}' to flight id=${this.flightId}`,
        );
      },
    );
  }

  removeGolfer(golfer: FlightGolfer): void {
    const substitute: Substitute = {
      flight_id: this.flightId,
      golfer_id: golfer.golfer_id,
      division_id: this.divisionNameToId[golfer.division],
    };

    this.teamsService.deleteSubstitute(substitute).subscribe(
      () => {
        console.log(
          `[SubstitutesSignupComponent] Deleted substitute '${golfer.name}' from flight id=${this.flightId}`,
        );
        this.notificationService.showSuccess(
          'Substitute Deleted',
          `Successfully deleted substitute '${golfer.name}'`,
          5000,
        );

        this.refreshTeamsForFlight.emit(this.flightId);

        this.clearNewSubstitute();
      },
      () => {
        console.error(
          `[SubstitutesSignupComponent] Unable to delete substitute '${golfer.name}' from flight id=${this.flightId}`,
        );
      },
    );
  }

  private clearNewSubstitute(): void {
    this.newGolfer = null;
    this.newGolferDivision = null;
  }
}
