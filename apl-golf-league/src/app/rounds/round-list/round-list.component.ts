import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";

import { RoundsService } from "../rounds.service";
import { Round, RoundSummary } from "../../shared/round.model";

@Component({
  selector: "app-round-list",
  templateUrl: "./round-list.component.html",
  styleUrls: ["./round-list.component.css"]
})
export class RoundListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;

  roundSummaries = new MatTableDataSource<RoundSummary>();
  expandedRound: Round | null;
  private roundsSub: Subscription;

  columnsToDisplay = ['date_played', 'course_name', 'tee_name', 'golfer_name', 'golfer_handicap_index'];
  @ViewChild(MatSort) sort: MatSort;

  totalRounds = 0;
  roundsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  constructor(private roundsService: RoundsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.roundsSub = this.roundsService.getRoundUpdateListener()
      .subscribe((roundData: {rounds: RoundSummary[]}) => {
        this.isLoading = false;
        this.roundSummaries = new MatTableDataSource<RoundSummary>(roundData.rounds);
        this.totalRounds = roundData.rounds.length;
      });
    this.roundsService.getRounds();
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

}
