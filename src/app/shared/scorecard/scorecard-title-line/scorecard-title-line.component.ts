import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { RoundData } from '../../round.model';

@Component({
    selector: 'app-scorecard-title-line',
    templateUrl: './scorecard-title-line.component.html',
    styleUrls: ['./scorecard-title-line.component.css'],
    standalone: false
})
export class ScorecardTitleLineComponent implements OnInit, OnChanges {
  @Input() rounds: RoundData | RoundData[];

  @Input() title: string;
  @Input() subtitle: string;

  @Input() selectedTeeRoundIdx!: number;
  @Output() selectedTeeRoundIdxChange = new EventEmitter<number>();

  course_name: string;
  track_name: string;
  date_played: Date;

  tees: TeeInfo[];
  selectedTee: TeeInfo;

  constructor() { }

  ngOnInit(): void {
    this.setRoundInfo();
    this.setTeeList();

    if (!this.selectedTee) {
      this.selectedTee = this.tees[0];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
    if (changes['rounds']) {
      this.selectedTee = this.tees[0];
      this.selectedTeeRoundIdx = 0;
      this.selectedTeeRoundIdxChange.emit(0); // TODO: fix NG0100 error
    }
  }

  selectTee(tee: TeeInfo): void {
    this.selectedTee = tee;

    // Find a matching round for displaying tee details
    let roundIdx = -1;
    if (this.rounds instanceof Array) {
      for (let rIdx = 0; rIdx < this.rounds.length; rIdx++) {
        const round = this.rounds[rIdx];
        if ((round.tee_name === tee.name) && (round.tee_gender == tee.gender)) {
          roundIdx = rIdx;
          break;
        }
      }
    }
    this.selectedTeeRoundIdx = roundIdx;
    this.selectedTeeRoundIdxChange.emit(roundIdx);
  }

  private setRoundInfo(): void {
    let firstRound: RoundData;
    if (this.rounds instanceof Array) {
      firstRound = this.rounds[0];
    } else {
      firstRound = this.rounds;
    }
    this.course_name = firstRound.course_name;
    this.track_name = firstRound.track_name;
    this.date_played = firstRound.date_played;
  }

  private setTeeList(): void {
    this.tees = [];
    if (this.rounds instanceof Array) {
      for (let round of this.rounds) {
        const tee = {
          name: round.tee_name,
          gender: round.tee_gender,
          rating: round.tee_rating,
          slope: round.tee_slope,
          color: round.tee_color
        };
        this.tees.push(tee)

        // Remove duplicate tees
        this.tees = this.tees.reduce((tees: TeeInfo[], current: TeeInfo) => {
          const teeIdx = tees.find(item => (item.name === current.name && item.gender === current.gender));
          if (!teeIdx) {
            return tees.concat([current]);
          }
          return tees;
        }, []);
      }
    }
  }

}

interface TeeInfo {
  name: string;
  gender: string;
  rating: number;
  slope: number;
  color?: string;
}
