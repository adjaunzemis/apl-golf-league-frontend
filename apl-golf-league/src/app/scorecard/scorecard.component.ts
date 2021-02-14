import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  holes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  pars = [5, 4, 5, 4, 3, 4, 4, 3, 4];
  yardages = [510, 380, 510, 380, 155, 380, 380, 155, 380];
  handicaps = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  grossScores = [2, 2, 4, 4, 4, 6, 7, 3, 4];
  netScores = [2, 2, 4, 4, 4, 6, 7, 4, 3];

  constructor() { }

  ngOnInit(): void {
  }

}
