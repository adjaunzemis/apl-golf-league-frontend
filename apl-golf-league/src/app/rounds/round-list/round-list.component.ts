import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
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
    console.log(pageData);
    this.isLoading = true;
    this.pageIndex = pageData.pageIndex;
    this.roundsPerPage = pageData.pageSize;
    this.roundsService.getRounds(this.pageIndex * this.roundsPerPage, this.roundsPerPage);
  }

}
