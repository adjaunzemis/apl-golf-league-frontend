import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { OfficersService } from '../officers.service';
import { Committee, Officer } from '../../shared/officer.model';
import { SeasonsService } from '../../seasons/seasons.service';

@Component({
  selector: 'app-officers-dashboard',
  templateUrl: './officers-dashboard.component.html',
  styleUrls: ['./officers-dashboard.component.css'],
  imports: [CommonModule, RouterModule, CardModule, DataViewModule, ProgressSpinnerModule],
})
export class OfficersDashboardComponent implements OnInit, OnDestroy {
  isLoading = true;

  private currentYear: number | undefined;
  private seasonsSub: Subscription;
  private seasonsService = inject(SeasonsService);

  officers = signal<Officer[]>([]);
  private officersSub: Subscription;
  private officersService = inject(OfficersService);

  ngOnInit(): void {
    this.officersSub = this.officersService.getOfficersListUpdateListener().subscribe((result) => {
      console.log(`[OfficersDashboardComponent] Received list of ${result.length} officers`);
      this.officers.set([...result]);
      this.isLoading = false;
    });

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.currentYear = result.year;
      this.officersService.getOfficersList(this.currentYear);
    });
  }

  ngOnDestroy(): void {
    this.officersSub.unsubscribe();
    this.seasonsSub.unsubscribe();
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
