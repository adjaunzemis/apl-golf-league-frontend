import { Component, Input, OnInit } from '@angular/core';

import { RoundData } from '../../shared/round.model';

@Component({
  selector: 'app-combined-rounds-scorecard',
  templateUrl: './combined-rounds-scorecard.component.html',
  styleUrls: ['./combined-rounds-scorecard.component.css']
})
export class CombinedRoundsScorecardComponent implements OnInit {
  @Input() rounds: RoundData[];

  scoreMode: string = "gross";

  ngOnInit(): void {
  }

}
