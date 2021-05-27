import { Component, Input } from "@angular/core";

import { GolfTeeSet } from "src/app/shared/golf-tee-set.model";
import { GolfHole } from "src/app/shared/golf-hole.model";

@Component({
  selector: "app-course-scorecard",
  templateUrl: "./course-scorecard.component.html",
  styleUrls: ["./course-scorecard.component.css"]
})
export class CourseScorecardComponent {
  @Input() teeSets: GolfTeeSet[];

  computeTeeSetPar(teeSet: GolfTeeSet): number {
    if (!teeSet.holes) {
      return -1;
    }
    return teeSet.holes.reduce(function(prev: number, cur: GolfHole) {
      return prev + cur.par;
    }, 0);
  }

  computeTeeSetYardage(teeSet: GolfTeeSet): number {
    if (!teeSet.holes) {
      return -1;
    }
    return teeSet.holes.reduce(function(prev: number, cur: GolfHole) {
      return prev + cur.yardage;
    }, 0);
  }

  hexToRGBA(hex: string, alpha: number) {
    console.log("hex: " + hex);
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);
    console.log("rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")");
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  }
}
