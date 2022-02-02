import { Component, Input, OnInit } from '@angular/core';

import { RoundData } from '../../shared/round.model';

@Component({
  selector: 'app-tournament-standings',
  templateUrl: './tournament-standings.component.html',
  styleUrls: ['./tournament-standings.component.css']
})
export class TournamentStandingsComponent implements OnInit {
  @Input() rounds: RoundData[];

  golferStandingsData: { [golfer_name : string] : TournamentGolferStandingsData } = {};
  orderedGolferNames: string[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let round of this.rounds) {
      if (!this.golferStandingsData[round.golfer_name]) {
        this.golferStandingsData[round.golfer_name] = new TournamentGolferStandingsData();
        this.golferStandingsData[round.golfer_name].golfer_name = round.golfer_name;
        this.orderedGolferNames.push(round.golfer_name);
      }
      this.golferStandingsData[round.golfer_name].golfer_playing_handicap += round.golfer_playing_handicap;
      this.golferStandingsData[round.golfer_name].gross_score += round.gross_score;
      this.golferStandingsData[round.golfer_name].net_score += round.net_score;
    }
  }

  getGolferName(golferName: string): string {
    return this.golferStandingsData[golferName].golfer_name;
  }

  getGolferPlayingHandicap(golferName: string): number {
    return this.golferStandingsData[golferName].golfer_playing_handicap;
  }

  getGrossScore(golferName: string): number {
    return this.golferStandingsData[golferName].gross_score;
  }

  getNetScore(golferName: string): number {
    return this.golferStandingsData[golferName].net_score;
  }

}

class TournamentGolferStandingsData {
  golfer_name: string;
  golfer_playing_handicap: number = 0;
  gross_score: number = 0;
  net_score: number = 0;
}
