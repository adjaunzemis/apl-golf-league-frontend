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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';

import { FlightDivision, FlightFreeAgent } from 'src/app/shared/flight.model';
import { Golfer } from 'src/app/shared/golfer.model';
import { TeamsService } from 'src/app/teams/teams.service';
import { FreeAgent, FreeAgentCadence } from 'src/app/shared/free-agent.model';
import { NotificationService } from 'src/app/notifications/notification.service';

@Component({
  selector: 'app-free-agents-signup',
  templateUrl: './free-agents-signup.component.html',
  styleUrl: './free-agents-signup.component.css',
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
export class FreeAgentsSignupComponent implements OnInit, OnChanges {
  @Output() refreshTeamsForFlight = new EventEmitter<number>();

  @Input() allowDelete = false;

  @Input() freeAgents: FlightFreeAgent[];

  @Input() golferOptions: Golfer[];

  @Input() flightId: number;
  @Input() divisionOptions: FlightDivision[];
  private divisionNameToId: Record<string, number> = {};

  newGolfer: Golfer | null = null;
  newGolferDivision: FlightDivision | null = null;
  newGolferCadence: FreeAgentCadence | undefined;

  cadenceOptions = [
    FreeAgentCadence.WEEKLY,
    FreeAgentCadence.BIWEEKLY,
    FreeAgentCadence.MONTHLY,
    FreeAgentCadence.OCCASIONALLY,
  ];

  private teamsService = inject(TeamsService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.updateDivisionIdMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['golferOptions'] || changes['flightId']) {
      this.clearNewFreeAgent();
    }

    if (changes['divisionOptions']) {
      this.clearNewFreeAgent();
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
    if (!this.newGolfer || !this.newGolferDivision || !this.newGolferCadence) {
      return;
    }

    const freeAgent: FreeAgent = {
      flight_id: this.flightId,
      golfer_id: this.newGolfer.id,
      division_id: this.newGolferDivision.id,
      cadence: this.newGolferCadence,
    };

    this.teamsService.addFreeAgent(freeAgent).subscribe(
      () => {
        console.log(
          `[FreeAgentsSignupComponent] Added free agent '${this.newGolfer?.name}' to flight id=${this.flightId}`,
        );
        this.notificationService.showSuccess(
          'FreeAgent Added',
          `Successfully added free agent '${this.newGolfer?.name}'`,
          5000,
        );

        this.refreshTeamsForFlight.emit(this.flightId);

        this.clearNewFreeAgent();
      },
      () => {
        console.error(
          `[FreeAgentsSignupComponent] Unable to add free agent '${this.newGolfer?.name}' to flight id=${this.flightId}`,
        );
      },
    );
  }

  removeGolfer(golfer: FlightFreeAgent): void {
    const freeAgent: FreeAgent = {
      flight_id: this.flightId,
      golfer_id: golfer.golfer_id,
      division_id: this.divisionNameToId[golfer.division],
      cadence: golfer.cadence,
    };

    this.teamsService.deleteFreeAgent(freeAgent).subscribe(
      () => {
        console.log(
          `[FreeAgentsSignupComponent] Deleted free agent '${golfer.name}' from flight id=${this.flightId}`,
        );
        this.notificationService.showSuccess(
          'FreeAgent Deleted',
          `Successfully deleted free agent '${golfer.name}'`,
          5000,
        );

        this.refreshTeamsForFlight.emit(this.flightId);

        this.clearNewFreeAgent();
      },
      () => {
        console.error(
          `[FreeAgentsSignupComponent] Unable to delete free agent '${golfer.name}' from flight id=${this.flightId}`,
        );
      },
    );
  }

  private clearNewFreeAgent(): void {
    this.newGolfer = null;
    this.newGolferDivision = null;
  }
}
