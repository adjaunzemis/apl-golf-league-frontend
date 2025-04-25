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

import { FlightDivision, FlightFreeAgentGolfer } from 'src/app/shared/flight.model';
import { Golfer } from 'src/app/shared/golfer.model';
import { TeamsService } from 'src/app/teams/teams.service';
import {
  FlightFreeAgent,
  FreeAgentCadence,
  TournamentFreeAgent,
} from 'src/app/shared/free-agent.model';
import { NotificationService } from 'src/app/notifications/notification.service';
import { TournamentDivision, TournamentFreeAgentGolfer } from 'src/app/shared/tournament.model';

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
  @Output() refreshTeamsForTournament = new EventEmitter<number>();

  @Input() allowDelete = false;

  @Input() freeAgents: FlightFreeAgentGolfer[] | TournamentFreeAgentGolfer[];

  @Input() golferOptions: Golfer[];

  @Input() flightId?: number;
  @Input() tournamentId?: number;
  @Input() divisionOptions: FlightDivision[] | TournamentDivision[];
  private divisionNameToId: Record<string, number> = {};

  newGolfer: Golfer | null = null;
  newGolferDivision: FlightDivision | null = null;
  newGolferCadence: FreeAgentCadence | null = null;

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
    if (!this.newGolfer || !this.newGolferDivision) {
      return;
    }

    if (this.flightId) {
      if (!this.newGolferCadence) {
        return;
      }

      const freeAgent: FlightFreeAgent = {
        flight_id: this.flightId,
        golfer_id: this.newGolfer.id,
        division_id: this.newGolferDivision.id,
        cadence: this.newGolferCadence,
      };

      this.teamsService.addFlightFreeAgent(freeAgent).subscribe(
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
    } else if (this.tournamentId) {
      const freeAgent: TournamentFreeAgent = {
        tournament_id: this.tournamentId,
        golfer_id: this.newGolfer.id,
        division_id: this.newGolferDivision.id,
      };

      this.teamsService.addTournamentFreeAgent(freeAgent).subscribe(
        () => {
          console.log(
            `[FreeAgentsSignupComponent] Added free agent '${this.newGolfer?.name}' to tournament id=${this.tournamentId}`,
          );
          this.notificationService.showSuccess(
            'FreeAgent Added',
            `Successfully added free agent '${this.newGolfer?.name}'`,
            5000,
          );

          this.refreshTeamsForTournament.emit(this.tournamentId);

          this.clearNewFreeAgent();
        },
        () => {
          console.error(
            `[FreeAgentsSignupComponent] Unable to add free agent '${this.newGolfer?.name}' to tournament id=${this.tournamentId}`,
          );
        },
      );
    }
  }

  removeGolfer(golfer: FlightFreeAgentGolfer): void {
    if (this.flightId) {
      const freeAgent: FlightFreeAgent = {
        flight_id: this.flightId,
        golfer_id: golfer.golfer_id,
        division_id: this.divisionNameToId[golfer.division],
        cadence: golfer.cadence,
      };

      this.teamsService.deleteFlightFreeAgent(freeAgent).subscribe(
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
    } else if (this.tournamentId) {
      const freeAgent: TournamentFreeAgent = {
        tournament_id: this.tournamentId,
        golfer_id: golfer.golfer_id,
        division_id: this.divisionNameToId[golfer.division],
      };

      this.teamsService.deleteTournamentFreeAgent(freeAgent).subscribe(
        () => {
          console.log(
            `[FreeAgentsSignupComponent] Deleted free agent '${golfer.name}' from tournament id=${this.tournamentId}`,
          );
          this.notificationService.showSuccess(
            'FreeAgent Deleted',
            `Successfully deleted free agent '${golfer.name}'`,
            5000,
          );

          this.refreshTeamsForTournament.emit(this.tournamentId);

          this.clearNewFreeAgent();
        },
        () => {
          console.error(
            `[FreeAgentsSignupComponent] Unable to delete free agent '${golfer.name}' from tournament id=${this.tournamentId}`,
          );
        },
      );
    }
  }

  private clearNewFreeAgent(): void {
    this.newGolfer = null;
    this.newGolferDivision = null;
    this.newGolferCadence = null;
  }
}
