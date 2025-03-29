import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { NotificationService } from '../../notifications/notification.service';
import { Golfer } from '../../shared/golfer.model';
import { GolfersService } from '../../golfers/golfers.service';
import { CommonModule } from '@angular/common';
import { FlightDivision, FlightTeam, FlightTeamGolfer } from 'src/app/shared/flight.model';
import { TeamsService } from '../teams.service';
import { TeamCreate, TeamGolferCreate } from 'src/app/shared/team.model';

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
})
export class TeamCreateComponent implements OnInit, OnDestroy, OnChanges {
  @Input() allowSubstitutes = false;
  @Input() allowDelete = false;

  @Input() flightId: number;
  @Input() divisionOptions: FlightDivision[];

  @Input() initialTeam: FlightTeam | null;
  teamId: number | null = null;
  teamGolfers: FlightTeamGolfer[] = [];

  teamName: string;

  newGolfer: Golfer | null = null;
  newGolferRole: string | undefined;
  newGolferDivision: FlightDivision | null = null;

  roleOptions = ['Captain', 'Player'];

  private divisionNameToId: Record<string, number> = {};

  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferOptionsArray: Observable<Golfer[]>[] = [];
  private golfersSub: Subscription;
  private golfersService = inject(GolfersService);

  private teamsService = inject(TeamsService);

  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    if (this.allowSubstitutes) {
      this.roleOptions.push('Substitute');
    }

    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((result) => {
      this.golferOptions = result.sort((a: Golfer, b: Golfer) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.golferNameOptions = result.map((golfer) => golfer.name);
    });

    this.golfersService.getAllGolfers();

    for (const d of this.divisionOptions) {
      this.divisionNameToId[d.name] = d.id;
    }
  }

  ngOnDestroy(): void {
    this.golfersSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialTeam']) {
      if (changes['initialTeam'].currentValue === null) {
        this.teamId = null;
        this.clearTeam();
      } else {
        const team: FlightTeam = changes['initialTeam'].currentValue;
        this.teamId = team.team_id;
        this.teamName = team.name;
        this.teamGolfers = team.golfers;
      }
    }
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
    // TODO: Validate? Or in API?

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

          // TODO: Refresh team list
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

          // TODO: Refresh team list
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

          // TODO: Refresh team list
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
}
