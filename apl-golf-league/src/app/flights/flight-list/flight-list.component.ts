import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subscription } from "rxjs";

import { FlightsService } from "../flights.service";
import { FlightData } from "../../shared/flight.model";

@Component({
  selector: "app-flight-list",
  templateUrl: "./flight-list.component.html",
  styleUrls: ["./flight-list.component.css"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class FlightListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;

  year: number | null;

  flightsData = new MatTableDataSource<FlightData>();
  expandedFlight: FlightData | null;
  private flightsSub: Subscription;

  columnsToDisplay = ['year', 'name', 'home_course_name'];
  @ViewChild(MatSort) sort: MatSort;

  numFlights = 0;
  flightsPerPage = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  constructor(private flightsService: FlightsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.flightsSub = this.flightsService.getFlightUpdateListener()
      .subscribe((result: {flights: FlightData[], numFlights: number}) => {
        console.log(`[FlightListComponent] Displaying rounds ${this.pageIndex * this.flightsPerPage + 1}-${this.pageIndex * this.flightsPerPage + result.flights.length} of ${result.numFlights}`);
        this.isLoading = false;
        this.flightsData = new MatTableDataSource<FlightData>(result.flights);
        this.numFlights = result.numFlights;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.year) {
          console.log("[FlightListComponent] Setting query parameter year=" + params.year);
          this.year = params.year;
        }
        }
    });

    this.getFlightData();
  }

  ngAfterViewInit(): void {
    this.flightsData.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
  }

  getFlightData(): void {
    if (this.year) {
      this.flightsService.getFlights(this.pageIndex * this.flightsPerPage, this.flightsPerPage, this.year);
    } else {
      this.flightsService.getFlights(this.pageIndex * this.flightsPerPage, this.flightsPerPage);
    }
  }

  doFilter = (event: Event) => {
    const target = <HTMLInputElement> event.target;
    this.flightsData.filter = target.value.trim().toLocaleLowerCase();
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.pageIndex = pageData.pageIndex;
    this.flightsPerPage = pageData.pageSize;
    this.getFlightData();
  }

}
