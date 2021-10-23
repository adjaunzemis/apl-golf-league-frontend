import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";

import { RoundsService } from "../rounds.service";
import { Round } from "../../shared/round.model";

@Component({
  selector: "app-round-list",
  templateUrl: "./round-list.component.html",
  styleUrls: ["./round-list.component.css"]
})
export class RoundListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;

  rounds = new MatTableDataSource<{ date: Date, course: string, tee: string, golfer: string, strokes: number }>();
  expandedRound: Round | null;
  private roundsSub: Subscription;

  columnsToDisplay = ['date', 'course', 'tee', 'golfer', 'strokes'];
  @ViewChild(MatSort) sort: MatSort;

  totalRounds = 0;
  roundsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  constructor(private roundsService: RoundsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.roundsSub = this.roundsService.getRoundUpdateListener()
      .subscribe((roundData: { rounds: { date: Date, course: string, tee: string, golfer: string, strokes: number }[] }) => {
        this.isLoading = false;
        this.rounds = new MatTableDataSource<{ date: Date, course: string, tee: string, golfer: string, strokes: number }>(roundData.rounds);
        this.totalRounds = roundData.rounds.length;
      });
    this.roundsService.getRounds();
  }

  ngAfterViewInit(): void {
    this.rounds.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.roundsSub.unsubscribe();
  }

  doFilter = (event: Event) => {
    const target = <HTMLInputElement> event.target;
    this.rounds.filter = target.value.trim().toLocaleLowerCase();
  }

}
