import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppConfigService } from '../app-config.service';
import { Officer } from './../shared/officer.model';
import { OfficersService } from '../officers/officers.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
  private currentYear: number

  isLoading = true;

  rulesCommittee: Officer[] = [];
  private officersSub: Subscription;

  constructor(private appConfigService: AppConfigService, private officersService: OfficersService) { }

  ngOnInit(): void {
    this.currentYear = this.appConfigService.currentYear;

    this.officersSub = this.officersService.getOfficersListUpdateListener()
      .subscribe(result => {
        console.log(`[RulesComponent] Received officers list`);
        this.rulesCommittee = result.filter((officer) => {
          return officer.committee.toString() === "RULES";
        });
        this.isLoading = false;
      })

    this.officersService.getOfficersList(0, 100, this.currentYear); // TODO: Un-hardcode query params
  }

  getCommitteeEmailList(): string {
    let emailList = "";
    for (const member of this.rulesCommittee) {
      emailList += member.email + ";"
    }
    return emailList.substring(0, emailList.length - 1);
  }

}
