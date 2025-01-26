import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Officer } from './../shared/officer.model';
import { OfficersService } from '../officers/officers.service';
import { SeasonsService } from '../seasons/seasons.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
  standalone: false,
})
export class RulesComponent implements OnInit, OnDestroy {
  private currentYear: number;
  private seasonsSub: Subscription;

  isLoading = true;

  rulesCommittee: Officer[] = [];
  private officersSub: Subscription;

  constructor(
    private seasonsService: SeasonsService,
    private officersService: OfficersService,
  ) {}

  ngOnInit(): void {
    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.currentYear = result.year;
      this.officersService.getOfficersList(this.currentYear);
    });

    this.officersSub = this.officersService.getOfficersListUpdateListener().subscribe((result) => {
      console.log(`[RulesComponent] Received officers list`);
      this.rulesCommittee = result.filter((officer) => {
        return officer.committee.toString() === 'RULES';
      });
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.seasonsSub.unsubscribe();
    this.officersSub.unsubscribe();
  }

  getCommitteeEmailList(): string {
    let emailList = '';
    for (const member of this.rulesCommittee) {
      emailList += member.email + ';';
    }
    return emailList.substring(0, emailList.length - 1);
  }
}
