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

  getScoringModes(): string {
    const modes: string[] = [];

    if (this.info.scramble) {
      modes.push('Shotgun');
    }
    if (this.info.scramble) {
      modes.push('Scramble');
    }
    if (this.info.bestball > 0) {
      if (this.info.bestball == 1) {
        modes.push('Best Ball');
      } else {
        modes.push(`Best Ball (${this.info.bestball})`);
      }
    }
    if (this.info.ryder_cup) {
      modes.push('Ryder Cup');
    }
    if (this.info.chachacha) {
      modes.push('Cha-Cha-Cha');
    }
    if (this.info.individual) {
      modes.push('Individual');
    }
    if (this.info.strokeplay) {
      modes.push('Strokeplay');
    }

    return modes.join(', ');
  }
}
