import { Component, Input, OnInit } from '@angular/core';

import { TournamentInfo } from '../../shared/tournament.model';
import { TournamentTeamData } from '../../shared/team.model';

@Component({
  selector: 'app-tournament-standings',
  templateUrl: './tournament-standings.component.html',
  styleUrls: ['./tournament-standings.component.css'],
})
export class TournamentStandingsComponent implements OnInit {
  @Input() tournament: TournamentInfo;
  @Input() teamData: TournamentTeamData[];

  scoreOptions: string[] = [];
  selectedScoreOption: string = '';

  individualStandingsData: {
    name: string;
    playingHandicap?: number;
    grossScore: number;
    netScore: number;
    position: string;
  }[];
  teamStandingsData: { name: string; grossScore: number; netScore: number; position: string }[];
  numTeamRoundsRequired = 4; // TODO: replace with team size

  constructor() {}

  ngOnInit(): void {
    this.scoreOptions = [];
    if (this.tournament.individual) {
      this.scoreOptions.push('Individual Gross', 'Individual Net');
    }
    if (this.tournament.scramble || this.tournament.bestball) {
      this.scoreOptions.push('Team Gross', 'Team Net');
    }
    this.individualStandingsData = [];
    this.teamStandingsData = [];
    for (const team of this.teamData) {
      const holeScores: { [holeNum: number]: { grossScores: number[]; netScores: number[] } } = [];

      if (team.rounds) {
        for (const round of team.rounds) {
          for (const hole of round.holes) {
            if (!holeScores[hole.number]) {
              holeScores[hole.number] = { grossScores: [], netScores: [] };
            }
            holeScores[hole.number].grossScores.push(hole.gross_score);
            holeScores[hole.number].netScores.push(hole.net_score);
          }

          let individualRoundAdded = false;
          for (const individualData of this.individualStandingsData) {
            if (individualData.name === round.golfer_name) {
              if (individualData.playingHandicap && round.golfer_playing_handicap) {
                individualData.playingHandicap += round.golfer_playing_handicap;
              }
              individualData.grossScore += round.gross_score;
              individualData.netScore += round.net_score;
              individualRoundAdded = true;
            }
          }
          if (!individualRoundAdded) {
            this.individualStandingsData.push({
              name: round.golfer_name,
              playingHandicap: round.golfer_playing_handicap,
              grossScore: round.gross_score,
              netScore: round.net_score,
              position: '',
            });
          }
        }

        if (team.rounds.length >= this.numTeamRoundsRequired) {
          const bestGrossScores: number[] = [];
          const bestNetScores: number[] = [];
          for (const holeNumber in holeScores) {
            bestGrossScores.push(Math.min(...holeScores[holeNumber].grossScores));
            bestNetScores.push(Math.min(...holeScores[holeNumber].netScores));
          }

          let grossScoreSum = bestGrossScores.reduce((partialSum, a) => partialSum + a, 0);
          let netScoreSum = bestNetScores.reduce((partialSum, a) => partialSum + a, 0);

          if (this.tournament.bestball === 2) {
            const secondBestGrossScores: number[] = [];
            const secondBestNetScores: number[] = [];
            for (const holeNumber in holeScores) {
              let minGrossScore = 99;
              let secondMinGrossScore = 99;
              let minNetScore = 99;
              let secondMinNetScore = 99;
              for (let scoreIdx = 0; scoreIdx < holeScores[holeNumber].grossScores.length; scoreIdx++) {
                if (holeScores[holeNumber].grossScores[scoreIdx] < minGrossScore) {
                  secondMinGrossScore = minGrossScore;
                  minGrossScore = holeScores[holeNumber].grossScores[scoreIdx];
                } else if (holeScores[holeNumber].grossScores[scoreIdx] < secondMinGrossScore) {
                  secondMinGrossScore = holeScores[holeNumber].grossScores[scoreIdx];
                }
                if (holeScores[holeNumber].netScores[scoreIdx] < minNetScore) {
                  secondMinNetScore = minNetScore;
                  minNetScore = holeScores[holeNumber].netScores[scoreIdx];
                } else if (holeScores[holeNumber].netScores[scoreIdx] < secondMinNetScore) {
                  secondMinNetScore = holeScores[holeNumber].netScores[scoreIdx];
                }
              }
              secondBestGrossScores.push(secondMinGrossScore);
              secondBestNetScores.push(secondMinNetScore);
            }
            grossScoreSum += secondBestGrossScores.reduce((partialSum, a) => partialSum + a, 0);
            netScoreSum += secondBestNetScores.reduce((partialSum, a) => partialSum + a, 0);
          }

          this.teamStandingsData.push({
            name: team.name,
            grossScore: grossScoreSum,
            netScore: netScoreSum,
            position: '',
          });
        }
      }
    }
  }

  toggleScoreOption(option: string): void {
    if (this.selectedScoreOption === option) {
      this.selectedScoreOption = '';
      return;
    }
    this.selectedScoreOption = option;

    // Sort standings data
    if (option === 'Individual Gross') {
      this.sortIndividualStandingsDataByGrossScore();
    } else if (option === 'Individual Net') {
      this.sortIndividualStandingsDataByNetScore();
    } else if (option === 'Team Gross') {
      this.sortTeamStandingsDataByGrossScore();
    } else if (option === 'Team Net') {
      this.sortTeamStandingsDataByNetScore();
    }
  }

  private sortIndividualStandingsDataByGrossScore() {
    this.individualStandingsData.sort(function (a, b) {
      return a.grossScore - b.grossScore;
    });

    this.individualStandingsData[0].position = '1';
    for (let idx = 1; idx < this.individualStandingsData.length; idx++) {
      if (this.individualStandingsData[idx].grossScore != this.individualStandingsData[idx - 1].grossScore) {
        this.individualStandingsData[idx].position = (idx + 1).toString();
      } else {
        this.individualStandingsData[idx].position = '';
      }
    }
  }

  private sortIndividualStandingsDataByNetScore() {
    this.individualStandingsData.sort(function (a, b) {
      return a.netScore - b.netScore;
    });

    this.individualStandingsData[0].position = '1';
    for (let idx = 1; idx < this.individualStandingsData.length; idx++) {
      if (this.individualStandingsData[idx].netScore != this.individualStandingsData[idx - 1].netScore) {
        this.individualStandingsData[idx].position = (idx + 1).toString();
      } else {
        this.individualStandingsData[idx].position = '';
      }
    }
  }

  private sortTeamStandingsDataByGrossScore() {
    this.teamStandingsData.sort(function (a, b) {
      return a.grossScore - b.grossScore;
    });

    this.teamStandingsData[0].position = '1';
    for (let idx = 1; idx < this.teamStandingsData.length; idx++) {
      if (this.teamStandingsData[idx].grossScore != this.teamStandingsData[idx - 1].grossScore) {
        this.teamStandingsData[idx].position = (idx + 1).toString();
      } else {
        this.teamStandingsData[idx].position = '';
      }
    }
  }

  private sortTeamStandingsDataByNetScore() {
    this.teamStandingsData.sort(function (a, b) {
      return a.netScore - b.netScore;
    });

    this.teamStandingsData[0].position = '1';
    for (let idx = 1; idx < this.teamStandingsData.length; idx++) {
      if (this.teamStandingsData[idx].netScore != this.teamStandingsData[idx - 1].netScore) {
        this.teamStandingsData[idx].position = (idx + 1).toString();
      } else {
        this.teamStandingsData[idx].position = '';
      }
    }
  }
}
