import { Component, Input, OnInit } from '@angular/core';

import { GolfRound } from '../../shared/golf-models';

@Component({
  selector: 'app-round-detail',
  templateUrl: './round-detail.component.html',
  styleUrls: ['./round-detail.component.css']
})
export class RoundDetailComponent implements OnInit {
  @Input() round: GolfRound;

  constructor() { }

  ngOnInit(): void {
  }

}
