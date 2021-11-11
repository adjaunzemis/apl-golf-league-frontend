import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subscription } from "rxjs";

import { GolfersService } from "../golfers.service";
import { GolferData } from "../../shared/golfer.model";

@Component({
  selector: "app-golfer-list",
  templateUrl: "./golfer-list.component.html",
  styleUrls: ["./golfer-list.component.css"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class GolferListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;

  year: number | null;

  golfersData = new MatTableDataSource<GolferData>();
  expandedGolfer: GolferData | null;
  private flightsSub: Subscription;

  columnsToDisplay = ['name', 'affiliation'];
  @ViewChild(MatSort) sort: MatSort;

  numGolfers = 0;
  golfersPerPage = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  constructor(private golfersService: GolfersService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.flightsSub = this.golfersService.getGolferUpdateListener()
      .subscribe((result: {golfers: GolferData[], numGolfers: number}) => {
        console.log(`[GolferListComponent] Displaying golfers ${this.pageIndex * this.golfersPerPage + 1}-${this.pageIndex * this.golfersPerPage + result.golfers.length} of ${result.numGolfers}`);
        this.isLoading = false;
        this.golfersData = new MatTableDataSource<GolferData>(result.golfers);
        this.numGolfers = result.numGolfers;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.year) {
          console.log("[GolferListComponent] Setting query parameter year=" + params.year);
          this.year = params.year;
        }
      }
    });

    this.getFlightData();
  }

  ngAfterViewInit(): void {
    this.golfersData.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
  }

  getFlightData(): void {
    if (this.year) {
      this.golfersService.getGolfers(this.pageIndex * this.golfersPerPage, this.golfersPerPage, this.year);
    } else {
      this.golfersService.getGolfers(this.pageIndex * this.golfersPerPage, this.golfersPerPage);
    }
  }

  doFilter = (event: Event) => {
    const target = <HTMLInputElement> event.target;
    this.golfersData.filter = target.value.trim().toLocaleLowerCase();
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.pageIndex = pageData.pageIndex;
    this.golfersPerPage = pageData.pageSize;
    this.getFlightData();
  }

}
