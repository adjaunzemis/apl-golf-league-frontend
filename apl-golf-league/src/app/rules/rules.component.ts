import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  rulesCommittee: RulesCommitteeMemberInfo[];

  ngOnInit(): void {
    this.rulesCommittee = [
      { name: "Eric Crossley", role: "Committee Chair", email: "Eric.Crossley@jhuapl.edu" },
      { name: "Gary Gafke", role: "Member", email: "ggafke@gmail.com" },
      { name: "Mark Mathews", role: "Member", email: "Mark.Mathews@jhuapl.edu" }
    ]
  }

  getCommitteeEmailList(): string {
    let emailList = "";
    for (const member of this.rulesCommittee) {
      emailList += member.email + ";"
    }
    return emailList.substring(0, emailList.length - 1);
  }

}

interface RulesCommitteeMemberInfo {
  name: string
  role: string
  email: string
}
