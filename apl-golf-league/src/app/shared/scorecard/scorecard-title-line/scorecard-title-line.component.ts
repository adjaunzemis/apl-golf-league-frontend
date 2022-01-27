import { Component, Input, OnInit } from '@angular/core';

import { RoundData } from '../../round.model';

@Component({
  selector: 'app-scorecard-title-line',
  templateUrl: './scorecard-title-line.component.html',
  styleUrls: ['./scorecard-title-line.component.css']
})
export class ScorecardTitleLineComponent implements OnInit {
  @Input() rounds: RoundData | RoundData[];

  course_name: string;
  track_name: string;
  date_played: Date;

  tees: TeeInfo[] = [];

  constructor() { }

  ngOnInit(): void {
    // TODO: Fix non-reloading when switching between rounds (e.g. team homepage)
    
    // Get general round info from first round
    let firstRound: RoundData;
    if (this.rounds instanceof Array) {
      firstRound = this.rounds[0];
    } else {
      firstRound = this.rounds;
    }
    this.course_name = firstRound.course_name;
    this.track_name = firstRound.track_name;
    this.date_played = firstRound.date_played;

    // Get unique tee info from rounds
    if (this.rounds instanceof Array) {
      for (let round of this.rounds) {
        const tee = {
          name: round.tee_name,
          gender: round.tee_gender,
          rating: round.tee_rating,
          slope: round.tee_slope,
          color: round.tee_color
        };

        // TODO: Fix duplicates in tee info list
        if (!this.tees.includes(tee)) {
          this.tees.push(tee);
        }
      }
    }
    console.log(this.tees);
  }

}

interface TeeInfo {
  name: string;
  gender: string;
  rating: number;
  slope: number;
  color?: string;
}
