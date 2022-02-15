import { Component, OnInit } from '@angular/core';

import { Committee, MOCK_OFFICERS } from './../shared/officer.model';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  // TODO: Replace placeholder officer info with database query
  rulesCommittee = MOCK_OFFICERS.filter((officer) => {
    return officer.committee === Committee.RULES;
  });

  ngOnInit(): void { }

  getCommitteeEmailList(): string {
    let emailList = "";
    for (const member of this.rulesCommittee) {
      emailList += member.email + ";"
    }
    return emailList.substring(0, emailList.length - 1);
  }

}
