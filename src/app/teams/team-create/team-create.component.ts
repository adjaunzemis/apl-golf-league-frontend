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
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NotificationService } from '../../notifications/notification.service';
import { Golfer } from '../../shared/golfer.model';
import { CommonModule } from '@angular/common';
import { FlightDivision, FlightTeam, FlightTeamGolfer } from 'src/app/shared/flight.model';
import { TeamsService } from '../teams.service';
import { TeamCreate, TeamGolferCreate } from 'src/app/shared/team.model';
import { GolferCreateComponent } from 'src/app/golfers/golfer-create/golfer-create.component';
import { GolfersService } from 'src/app/golfers/golfers.service';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    TableModule,
  ],
  providers: [DialogService],
})
export class TeamCreateComponent implements OnInit, OnChanges {
  @Output() refreshTeamsForFlight = new EventEmitter<number>();

  @Input() allowSubstitutes = false;
  @Input() allowDelete = false;

  @Input() golferOptions: Golfer[] = [];

  @Input() flightId: number;
  @Input() divisionOptions: FlightDivision[];
  private divisionNameToId: Record<string, number> = {};

  @Input() initialTeam: FlightTeam | null;
  teamId: number | null = null;
  teamGolfers: FlightTeamGolfer[] = [];

  teamName: string;

  newGolfer: Golfer | null = null;
  newGolferRole: string | undefined;
  newGolferDivision: FlightDivision | null = null;

  roleOptions = ['Captain', 'Player'];

  private teamsService = inject(TeamsService);

  dialogRef: DynamicDialogRef | undefined;
  public dialogService = inject(DialogService);
  private golfersService = inject(GolfersService);

  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    if (this.allowSubstitutes) {
      this.roleOptions.push('Substitute');
    }

    this.updateDivisionIdMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['golferOptions'] || changes['flightId']) {
      this.clear();
    }

    if (changes['divisionOptions']) {
      this.clear();
      this.updateDivisionIdMap();
    }

    if (changes['initialTeam']) {
      this.clear();
      this.teamId = null;
      if (changes['initialTeam'].currentValue !== null) {
        this.refreshFromTeam(changes['initialTeam'].currentValue as FlightTeam);
      }
    }
  }

  private updateDivisionIdMap(): void {
    this.divisionNameToId = {};
    for (const d of this.divisionOptions) {
      this.divisionNameToId[d.name] = d.id;
    }
  }

  private refreshFromTeam(team: FlightTeam): void {
    this.teamId = team.team_id;
    this.teamName = team.name;
    this.teamGolfers = [...team.golfers];
  }

  addGolferToTeam(): void {
    if (!this.newGolfer || !this.newGolferDivision || this.newGolferRole === undefined) {
      return;
    }

    this.teamGolfers.push({
      golfer_id: this.newGolfer.id,
      name: this.newGolfer.name,
      role: this.newGolferRole,
      division: this.newGolferDivision.name,
    });

    this.clearNewGolfer();
  }

  removeGolferFromTeam(golfer: FlightTeamGolfer): void {
    this.teamGolfers = this.teamGolfers.filter(
      (teamGolfer) => teamGolfer.golfer_id !== golfer.golfer_id,
    );
  }

  submitTeam(): void {
    const golfers: TeamGolferCreate[] = [];
    for (const teamGolfer of this.teamGolfers) {
      golfers.push({
        golfer_id: teamGolfer.golfer_id,
        golfer_name: teamGolfer.name,
        role: teamGolfer.role,
        division_id: this.divisionNameToId[teamGolfer.division],
      });
    }

    const teamData: TeamCreate = {
      flight_id: this.flightId,
      name: this.teamName,
      golfers: golfers,
    };
    if (this.teamId) {
      // update existing team
      teamData['id'] = this.teamId;
      this.teamsService.updateTeam(teamData).subscribe(
        (team) => {
          console.log(`[TeamCreateComponent] Updated team '${team.name}' (id=${team.id})`);
          this.notificationService.showSuccess(
            'Team Updated',
            `Successfully updated team '${team.name}'`,
            5000,
          );

          this.clear();

          this.refreshTeamsForFlight.emit(this.flightId);
        },
        () => {
          console.error(
            `[TeamCreateComponent] Unable to update team '${teamData.name}' (id=${teamData.id})`,
          );
        },
      );
    } else {
      // create new team
      this.teamsService.createTeam(teamData).subscribe(
        (team) => {
          console.log(`[TeamCreateComponent] Created team '${team.name}' (id=${team.id})`);
          this.notificationService.showSuccess(
            'Team Created',
            `Successfully created team '${team.name}'`,
            5000,
          );

          this.clear();

          this.refreshTeamsForFlight.emit(this.flightId);
        },
        () => {
          console.error(`[TeamCreateComponent] Unable to create team '${teamData.name}'`);
        },
      );
    }
  }

  deleteTeam(): void {
    if (this.teamId) {
      this.teamsService.deleteTeam(this.teamId).subscribe(
        (team) => {
          console.log(`[TeamCreateComponent] Deleted team '${team.name}' (id=${team.id})`);
          this.notificationService.showSuccess(
            'Team Deleted',
            `Successfully deleted team '${team.name}'`,
            5000,
          );

          this.clear();

          this.refreshTeamsForFlight.emit(this.flightId);
        },
        () => {
          console.error(`[TeamCreateComponent] Unable to delete team id=${this.teamId}`);
        },
      );
    }
  }

  clear(): void {
    this.clearNewGolfer();
    this.clearTeam();
  }

  private clearTeam(): void {
    this.teamId = null;
    this.teamName = '';
    this.teamGolfers = [];
  }

  private clearNewGolfer(): void {
    this.newGolfer = null;
    this.newGolferRole = undefined;
    this.newGolferDivision = null;
  }

  onRegisterGolfer(): void {
    this.dialogRef = this.dialogService.open(GolferCreateComponent, {
      width: '300px',
      modal: true,
    });

    this.dialogRef.onClose.subscribe((golferData) => {
      if (golferData !== null && golferData !== undefined) {
        this.golfersService
          .createGolfer(
            golferData.name,
            golferData.affiliation,
            golferData.email,
            golferData.phone !== '' ? golferData.phone : null,
          )
          .subscribe((result) => {
            console.log(`[TeamCreateComponent] Successfully registered golfer: ${result.name}`);
            this.notificationService.showSuccess(
              'Registered Golfer',
              `Successfully registered golfer: ${result.name}`,
              5000,
            );

            this.golfersService.getAllGolfers();
          });
      }
    });
  }
}
