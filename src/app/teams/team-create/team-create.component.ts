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
  @Input() update = false;
  @Input() allowSubstitutes = false;
  @Input() divisionOptions: FlightDivision[];

  @Input() teamGolfers: FlightTeamGolfer[] = [];

  teamName: string;
  newGolfer: Golfer | null;
  newGolferRole: string;
  newGolferDivision: FlightDivision | null = null;

  roleOptions = ['Captain', 'Player'];

  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferOptionsArray: Observable<Golfer[]>[] = [];
  private golfersSub: Subscription;
  private golfersService = inject(GolfersService);

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
  }

  ngOnDestroy(): void {
    this.golfersSub.unsubscribe();
  }

  private isGolfer(object: unknown): object is Golfer {
    return (object as Golfer).name !== undefined;
  }

  private _filter(value: string): Golfer[] {
    const filterValue = value.toLowerCase();
    return this.golferOptions.filter((option) => option.name.toLowerCase().includes(filterValue));
  }

  addGolferToTeam(): void {
    // TODO: Validate entries
    if (!this.newGolfer || !this.newGolferDivision) {
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
    console.log('Removing golfer: ' + golfer.name);
  }

  submitTeam(): void {
    // TODO: Send API request

    this.clear();
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
    this.newGolferRole = '';
    this.newGolferDivision = null;
  }
}
