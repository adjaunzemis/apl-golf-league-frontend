import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LeagueHomeComponent } from "./league-home/league-home.component";
import { FlightHomeComponent } from "./flights/flight-home/flight-home.component";
import { TournamentHomeComponent } from './tournaments/tournament-home/tournament-home.component';
import { TeamHomeComponent } from "./flights/team-home/team-home.component";
import { CourseListComponent } from "./courses/course-list/course-list.component";
import { CourseCreateComponent } from "./courses/course-create/course-create.component";
import { GolferHomeComponent } from "./golfers/golfer-home/golfer-home.component";
import { FlightHistoryComponent } from "./flights/flight-history/flight-history.component";

const routes: Routes = [
  { path: "", component: LeagueHomeComponent },
  { path: "flight", component: FlightHomeComponent},
  { path: "flight/team", component: TeamHomeComponent },
  { path: "flight/history", component: FlightHistoryComponent },
  { path: "tournament", component: TournamentHomeComponent },
  { path: "golfer", component: GolferHomeComponent },
  { path: "courses", component: CourseListComponent },
  { path: "courses/edit", component: CourseCreateComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
