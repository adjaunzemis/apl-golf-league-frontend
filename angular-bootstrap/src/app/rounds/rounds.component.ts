import { Component, OnInit } from '@angular/core';

import { GolfRound } from './../shared/golf-models';

@Component({
  selector: 'app-rounds',
  templateUrl: './rounds.component.html',
  styleUrls: ['./rounds.component.css']
})
export class RoundsComponent implements OnInit {
  selectedRound: GolfRound;

  constructor() { }

  ngOnInit(): void {
  }

}
