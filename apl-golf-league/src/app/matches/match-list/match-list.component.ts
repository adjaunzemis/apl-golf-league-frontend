import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subscription } from "rxjs";

import { MatchesService } from './../matches.service';
import { MatchData } from "src/app/shared/match.model";

@Component({
  selector: "app-match-list",
  templateUrl: "./match-list.component.html",
  styleUrls: ["./match-list.component.css"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class MatchListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;

  teamId: number | null;

  matchesData = new MatTableDataSource<MatchData>();
  expandedMatch: MatchData | null;
  private matchesSub: Subscription;

  columnsToDisplay = ['flight_name', 'week', 'home_score', 'away_score'];
  @ViewChild(MatSort) sort: MatSort;

  numMatches = 0;
  matchesPerPage = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  constructor(private matchesService: MatchesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.matchesSub = this.matchesService.getMatchUpdateListener()
      .subscribe((result: {matches: MatchData[], numMatches: number}) => {
        console.log(`[MatchesListComponent] Displaying matches ${this.pageIndex * this.matchesPerPage + 1}-${this.pageIndex * this.matchesPerPage + result.matches.length} of ${result.numMatches}`);
        this.isLoading = false;
        this.matchesData = new MatTableDataSource<MatchData>(result.matches);
        this.numMatches = result.numMatches;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.team_id) {
          console.log("[MatchesListComponent] Setting query parameter team_id=" + params.team_id);
          this.teamId = params.team_id;
        }
        }
    });

    this.getMatchData();
  }

  ngAfterViewInit(): void {
    this.matchesData.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.matchesSub.unsubscribe();
  }

  getMatchData(): void {
    if (this.teamId)
    {
      this.matchesService.getMatches(this.pageIndex * this.matchesPerPage, this.matchesPerPage, this.teamId);
    } else {
      this.matchesService.getMatches(this.pageIndex * this.matchesPerPage, this.matchesPerPage);
    }
  }

  doFilter = (event: Event) => {
    const target = <HTMLInputElement> event.target;
    this.matchesData.filter = target.value.trim().toLocaleLowerCase();
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.pageIndex = pageData.pageIndex;
    this.matchesPerPage = pageData.pageSize;
    this.getMatchData();
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
