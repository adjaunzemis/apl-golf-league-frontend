import { Component, Input, OnInit } from '@angular/core';

import { RoundData } from '../../round.model';

@Component({
  selector: 'app-scorecard-title-line',
  templateUrl: './scorecard-title-line.component.html',
  styleUrls: ['./scorecard-title-line.component.css']
})
export class ScorecardTitleLineComponent implements OnInit {
  @Input() round: RoundData;

  constructor() { }

  ngOnInit(): void {
  }

}
