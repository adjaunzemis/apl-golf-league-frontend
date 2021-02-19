import { Component, OnInit } from '@angular/core';

import { GolfRound } from './../shared/golf-models';
import { MOCK_ROUND, WOODHOLME_FRONT_ROUND, TIMBERS_FRONT_ROUND } from '../shared/mock-data';

@Component({
  selector: 'app-round-list',
  templateUrl: './round-list.component.html',
  styleUrls: ['./round-list.component.css']
})
export class RoundListComponent implements OnInit {

  rounds: GolfRound[] = [
    TIMBERS_FRONT_ROUND,
    WOODHOLME_FRONT_ROUND,
    MOCK_ROUND
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
