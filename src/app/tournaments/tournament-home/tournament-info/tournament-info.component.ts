import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { TournamentInfo } from 'src/app/shared/tournament.model';

@Component({
  selector: 'app-tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrl: './tournament-info.component.css',
  imports: [CommonModule, CardModule],
})
export class TournamentInfoComponent {
  @Input() info: TournamentInfo;

  getAddressLine1(): string {
    if (!this.info.address) {
      return '';
    }
    return this.info.address.split(',')[0];
  }

  getAddressLine2(): string {
    if (!this.info.address) {
      return '';
    }
    return this.info.address.split(',').slice(1).join(', ');
  }
}
