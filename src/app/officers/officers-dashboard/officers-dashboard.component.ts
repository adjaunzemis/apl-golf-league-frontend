import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { OfficersService } from '../officers.service';
import { Committee, Officer } from '../../shared/officer.model';
import { Season } from 'src/app/shared/season.model';

@Component({
  selector: 'app-officers-dashboard',
  templateUrl: './officers-dashboard.component.html',
  styleUrls: ['./officers-dashboard.component.css'],
  imports: [CommonModule, RouterModule, CardModule, DataViewModule, ProgressSpinnerModule],
})
export class OfficersDashboardComponent implements OnInit, OnDestroy, OnChanges {
  isLoading = true;

  @Input() season!: Season;

  officers = signal<Officer[]>([]);
  private officersSub: Subscription;
  private officersService = inject(OfficersService);

  ngOnInit(): void {
    this.officersSub = this.officersService.getOfficersListUpdateListener().subscribe((result) => {
      console.log(`[OfficersDashboardComponent] Received list of ${result.length} officers`);
      this.officers.set([...result]);
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.officersSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['season'] && this.season) {
      this.isLoading = true;
      this.officersService.getOfficersList(this.season.year);
    }
  }

  getTitle(): string {
    let title = 'Officers';
    if (this.season && !this.season.is_active) {
      title += ` (${this.season.year})`;
    }
    return title;
  }

  getLeagueOfficersEmailList(): string {
    let emailList = '';
    for (const officer of this.officers()) {
      if (officer.committee === Committee.LEAGUE) {
        emailList += officer.email + ';';
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }
}
