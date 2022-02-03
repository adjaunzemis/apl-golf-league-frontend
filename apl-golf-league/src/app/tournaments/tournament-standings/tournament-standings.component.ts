import { Component, Input, OnInit } from '@angular/core';

import { RoundData } from '../../shared/round.model';
import { TournamentTeamData } from '../../shared/team.model';

@Component({
  selector: 'app-tournament-standings',
  templateUrl: './tournament-standings.component.html',
  styleUrls: ['./tournament-standings.component.css']
})
export class TournamentStandingsComponent implements OnInit {
  @Input() teamData: TournamentTeamData[];
  private rounds: RoundData[];

  scoreOptions = ["Individual Gross", "Individual Net", "Team Gross", "Team Net"]
  selectedScoreOption: string = "";

  individualStandingsData: { name: string, playingHandicap: number, grossScore: number, netScore: number, position: string }[]
  teamStandingsData: { name: string, grossScore: number, netScore: number, position: string }[]

  constructor() { }

  ngOnInit(): void {
    this.compileRoundData();

    this.individualStandingsData = [];
    for (let round of this.rounds) {
      let roundAdded = false;
      for (let data of this.individualStandingsData) {
        if (data.name === round.golfer_name) {
          data.grossScore += round.gross_score;
          data.netScore += round.net_score;
          roundAdded = true;
        }
      }
      if (!roundAdded) {
        this.individualStandingsData.push({
          name: round.golfer_name,
          playingHandicap: round.golfer_playing_handicap,
          grossScore: round.gross_score,
          netScore: round.net_score,
          position: ""
        });
      }
    }
  }

  toggleScoreOption(option: string): void {
    if (this.selectedScoreOption === option) {
      this.selectedScoreOption = "";
      return;
    }
    this.selectedScoreOption = option;

    // Sort standings data
    if (option == "Individual Gross") {
      this.sortIndividualStandingsDataByGrossScore();
    } else if (option == "Individual Net") {
      this.sortIndividualStandingsDataByNetScore();
    }
  }

  private compileRoundData(): void {
    this.rounds = [];
    for (let team of this.teamData) {
      if (team.rounds) {
        for (let round of team.rounds) {
          this.rounds.push(round);
        }
      }
    }
  }

  private sortIndividualStandingsDataByGrossScore() {
    this.individualStandingsData.sort(function(a, b) {
      return a.grossScore - b.grossScore;
    });

    this.individualStandingsData[0].position = "1";
    for (let idx = 1; idx < this.individualStandingsData.length; idx++) {
      if (this.individualStandingsData[idx].grossScore != this.individualStandingsData[idx-1].grossScore) {
        this.individualStandingsData[idx].position = (idx + 1).toString();
      } else {
        this.individualStandingsData[idx].position = "";
      }
    }
  }

  private sortIndividualStandingsDataByNetScore() {
    this.individualStandingsData.sort(function(a, b) {
      return a.netScore - b.netScore;
    });

    this.individualStandingsData[0].position = "1";
    for (let idx = 1; idx < this.individualStandingsData.length; idx++) {
      if (this.individualStandingsData[idx].netScore != this.individualStandingsData[idx-1].netScore) {
        this.individualStandingsData[idx].position = (idx + 1).toString();
      } else {
        this.individualStandingsData[idx].position = "";
      }
    }
  }

}
