import { Component, Input, OnInit } from "@angular/core";

import { HoleResultData } from "src/app/shared/hole-result.model";

@Component({
  selector: "app-scorecard-tee-info",
  templateUrl: "./scorecard-tee-info.component.html",
  styleUrls: ["./scorecard-tee-info.component.css"]
})
export class ScorecardTeeInfoComponent implements OnInit{
  @Input() holes: HoleResultData[];

  totalPar: number = 0;
  totalYardage: number = 0;

  ngOnInit(): void {
    this.totalPar = this.holes.reduce(function(prev: number, cur: HoleResultData) {
      return cur.par ? prev + cur.par : 0;
    }, 0);

    this.totalYardage = this.holes.reduce(function(prev: number, cur: HoleResultData) {
      return cur.yardage ? prev + cur.yardage : 0;
    }, 0);
  }
}
