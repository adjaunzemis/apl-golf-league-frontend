import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subscription } from "rxjs";

import { RoundsService } from "../rounds.service";
import { RoundSummary } from "../../shared/round.model";
import { HoleResultSummary } from "src/app/shared/hole-result.model";

@Component({
  selector: "app-round-list",
  templateUrl: "./round-list.component.html",
  styleUrls: ["./round-list.component.css"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class RoundListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;

  roundSummaries = new MatTableDataSource<RoundSummary>();
  expandedRound: RoundSummary | null;
  private roundsSub: Subscription;

  columnsToDisplay = ['date_played', 'course_name', 'tee_name', 'golfer_name', 'golfer_handicap_index'];
  @ViewChild(MatSort) sort: MatSort;

  totalRounds = 0;
  roundsPerPage = 20;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  constructor(private roundsService: RoundsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.roundsSub = this.roundsService.getRoundUpdateListener()
      .subscribe((roundData: {rounds: RoundSummary[], totalRounds: number}) => {
        this.isLoading = false;
        this.roundSummaries = new MatTableDataSource<RoundSummary>(roundData.rounds);
        this.totalRounds = roundData.totalRounds;
      });
    this.roundsService.getRounds(0, this.roundsPerPage);
  }

  ngAfterViewInit(): void {
    this.roundSummaries.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.roundsSub.unsubscribe();
  }

  doFilter = (event: Event) => {
    const target = <HTMLInputElement> event.target;
    this.roundSummaries.filter = target.value.trim().toLocaleLowerCase();
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.pageIndex = pageData.pageIndex;
    this.roundsPerPage = pageData.pageSize;
    this.roundsService.getRounds(this.pageIndex * this.roundsPerPage, this.roundsPerPage);
  }

  computeRoundPar(round: RoundSummary): number {
    if (!round.round_holes) {
      return -1;
    }
    return round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_par;
    }, 0);
  }
  
  computeRoundGross(round: RoundSummary): number {
    if (!round.round_holes) {
      return -1;
    }
    return round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_result_strokes;
    }, 0);
  }

  computeHoleAdjustedGross(round: RoundSummary, hole: HoleResultSummary): number {
    // TODO Account for equitable stroke control
    // TODO Compute on backend, store in database with results?
    return hole.hole_result_strokes;
  }

  computeRoundAdjustedGross(round: RoundSummary): number {
    // TODO Account for equitable stroke control
    // TODO Compute on backend, store in database with results?
    if (!round.round_holes) {
      return -1;
    }
    return round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_result_strokes;
    }, 0);
  }

  computeHoleHandicapStrokes(holeStrokeIndex: number, golferHandicapIndex: number): number {
    // TODO Compute on backend, store in database with results?
    if (golferHandicapIndex < 0) {
      return 0; // TODO Account for plus-handicap golfers
    }
    if (golferHandicapIndex < 19) {
      if (holeStrokeIndex <= golferHandicapIndex) {
        return 1;
      }
      return 0;
    }
    if (golferHandicapIndex < 37) {
      if (holeStrokeIndex <= golferHandicapIndex - 18) {
        return 2;
      }
      return 1;
    }
    if (golferHandicapIndex < 55) {
      if (holeStrokeIndex <= golferHandicapIndex - 18) {
        return 3;
      }
      return 2;
    }
    return 0;
  }

  computeHoleNet(hole: HoleResultSummary, golferHandicapIndex: number) {
    const handicapStrokes = this.computeHoleHandicapStrokes(hole.hole_stroke_index, golferHandicapIndex);
    return hole.hole_result_strokes - handicapStrokes;
  }

  computeRoundNet(round: RoundSummary): number {
    if (!round.round_holes) {
      return -1;
    }
    return round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_result_strokes;
    }, 0);
  }

  getRelativeScoreString(score: number, par: number): string {
    const relativeScore = score - par;
    if (relativeScore > 0) {
      return "+" + relativeScore;
    } else if (relativeScore < 0) {
      return "-" + relativeScore;
    } else {
      return "E"
    }
  }

  getRoundRelativeGrossString(round: RoundSummary): string {
    return this.getRelativeScoreString(this.computeRoundGross(round), this.computeRoundPar(round));
  }

  getRoundRelativeAdjustedGrossString(round: RoundSummary): string {
    return this.getRelativeScoreString(this.computeRoundAdjustedGross(round), this.computeRoundPar(round));
  }

  getRoundRelativeNetString(round: RoundSummary): string {
    return this.getRelativeScoreString(this.computeRoundNet(round), round.golfer_handicap_index);
  }
}
