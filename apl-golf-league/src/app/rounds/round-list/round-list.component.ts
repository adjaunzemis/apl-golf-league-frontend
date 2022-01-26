import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subscription } from "rxjs";

import { RoundsService } from "../rounds.service";
import { RoundData } from "../../shared/round.model";

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

  golferId: number | null;

  roundsData = new MatTableDataSource<RoundData>();
  expandedRound: RoundData | null;
  private roundsSub: Subscription;

  columnsToDisplay = ['date_played', 'golfer_name', 'golfer_handicap_index', 'golfer_playing_handicap', 'gross_score', 'course_name', 'track_name', 'tee_name', 'tee_gender', 'tee_par', 'tee_rating', 'tee_slope', 'tee_color'];
  @ViewChild(MatSort) sort: MatSort;

  numRounds = 0;
  roundsPerPage = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  constructor(private roundsService: RoundsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.roundsSub = this.roundsService.getRoundUpdateListener()
      .subscribe((result: {rounds: RoundData[], numRounds: number}) => {
        console.log(`[RoundsListComponent] Displaying rounds ${this.pageIndex * this.roundsPerPage + 1}-${this.pageIndex * this.roundsPerPage + result.rounds.length} of ${result.numRounds}`);
        this.isLoading = false;
        this.roundsData = new MatTableDataSource<RoundData>(result.rounds);
        this.numRounds = result.numRounds;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.golfer_id) {
          console.log("[RoundsListComponent] Setting query parameter golfer_id=" + params.golfer_id);
          this.golferId = params.golfer_id;
        }
        }
    });

    this.getRoundData();
  }

  ngAfterViewInit(): void {
    this.roundsData.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.roundsSub.unsubscribe();
  }

  getRoundData(): void {
    if (this.golferId)
    {
      this.roundsService.getRounds(this.pageIndex * this.roundsPerPage, this.roundsPerPage, this.golferId);
    } else {
      this.roundsService.getRounds(this.pageIndex * this.roundsPerPage, this.roundsPerPage);
    }
  }

  doFilter = (event: Event) => {
    const target = <HTMLInputElement> event.target;
    this.roundsData.filter = target.value.trim().toLocaleLowerCase();
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.pageIndex = pageData.pageIndex;
    this.roundsPerPage = pageData.pageSize;
    this.getRoundData();
  }

  getRelativeScoreString(score: number, par: number): string {
    const relativeScore = score - par;
    if (relativeScore > 0) {
      return "+" + relativeScore;
    } else if (relativeScore < 0) {
      return "" + relativeScore;
    } else {
      return "E"
    }
  }

}
