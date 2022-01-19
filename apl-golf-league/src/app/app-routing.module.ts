import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LeagueHomeComponent } from "./league-home/league-home.component";
import { FlightsHomeComponent } from "./flights/flights-home/flights-home.component";
import { TeamHomeComponent } from "./flights/team-home/team-home.component";
import { CourseListComponent } from "./courses/course-list/course-list.component";
import { CourseCreateComponent } from "./courses/course-create/course-create.component";
import { GolferListComponent } from "./golfers/golfer-list/golfer-list.component";
import { RoundListComponent } from "./rounds/round-list/round-list.component";
import { FlightListComponent } from "./flights/flight-list/flight-list.component";
import { MatchListComponent } from "./matches/match-list/match-list.component";
import { GolferHomeComponent } from "./golfers/golfer-home/golfer-home.component";

const routes: Routes = [
  { path: "", component: LeagueHomeComponent },
  { path: "flights", component: FlightsHomeComponent },
  { path: "flights/team", component: TeamHomeComponent },
  { path: "golfers", component: GolferHomeComponent },
  { path: "courses", component: CourseListComponent },
  { path: "courses/edit", component: CourseCreateComponent },
  { path: "golfer-list", component: GolferListComponent },
  { path: "flight-list", component: FlightListComponent },
  { path: "round-list", component: RoundListComponent },
  { path: "match-list", component: MatchListComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
