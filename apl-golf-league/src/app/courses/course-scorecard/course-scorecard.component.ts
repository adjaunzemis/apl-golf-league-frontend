import { Component, Input } from "@angular/core";

import { Tee } from "src/app/shared/tee.model";
import { Hole } from "src/app/shared/hole.model";

@Component({
  selector: "app-course-scorecard",
  templateUrl: "./course-scorecard.component.html",
  styleUrls: ["./course-scorecard.component.css"]
})
export class CourseScorecardComponent {
  @Input() tees: Tee[];

  computeTeePar(tee: Tee): number {
    if (!tee.holes) {
      return -1;
    }
    return tee.holes.reduce(function(prev: number, cur: Hole) {
      return prev + cur.par;
    }, 0);
  }

  computeTeeYardage(tee: Tee): number {
    if (!tee.holes) {
      return -1;
    }
    return tee.holes.reduce(function(prev: number, cur: Hole) {
      return cur.yardage ? prev + cur.yardage : 0;
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
