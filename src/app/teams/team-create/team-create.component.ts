import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { FlightDivision, FlightTeamGolfer } from 'src/app/shared/flight.model';
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
export class TeamCreateComponent implements OnInit, OnDestroy {
  @Input() allowSubstitutes = false;
  @Input() flightId: number;
  @Input() divisionOptions: FlightDivision[];
  @Input() teamId?: number;
  @Input() teamGolfers: FlightTeamGolfer[] = [];

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

  addGolferToTeam(): void {
    // TODO: Validate entries
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
    // TODO: Validate

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
            `[SignupComponent] Unable to update team '${teamData.name}' (id=${teamData.id})`,
          );
        },
      );
    } else {
      // create new team
      this.teamsService.createTeam(teamData).subscribe(
        (team) => {
          console.log(`[SignupComponent] Created team '${team.name}' (id=${team.id})`);
          this.notificationService.showSuccess(
            'Team Created',
            `Successfully created team '${team.name}'`,
            5000,
          );

          this.clear();

          // TODO: Refresh team list
        },
        () => {
          console.error(`[SignupComponent] Unable to create team '${teamData.name}'`);
        },
      );
    }
  }

  clear(): void {
    this.clearNewGolfer();
    this.clearTeam();
  }

  private clearTeam(): void {
    this.teamName = '';
    this.teamGolfers = [];
  }

  private clearNewGolfer(): void {
    this.newGolfer = null;
    this.newGolferRole = undefined;
    this.newGolferDivision = null;
  }
}
