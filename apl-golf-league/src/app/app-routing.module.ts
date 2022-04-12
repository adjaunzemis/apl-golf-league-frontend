import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";
import { LeagueHomeComponent } from "./league-home/league-home.component";
import { FlightHomeComponent } from "./flights/flight-home/flight-home.component";
import { TournamentHomeComponent } from './tournaments/tournament-home/tournament-home.component';
import { TeamHomeComponent } from "./flights/team-home/team-home.component";
import { FlightSignupComponent } from "./flights/flight-signup/flight-signup.component";
import { FlightMatchCreateComponent } from "./flights/flight-match-create/flight-match-create.component";
import { CourseListComponent } from "./courses/course-list/course-list.component";
import { CourseCreateComponent } from "./courses/course-create/course-create.component";
import { GolferHomeComponent } from "./golfers/golfer-home/golfer-home.component";
import { FlightHistoryComponent } from "./flights/flight-history/flight-history.component";
import { TournamentHistoryComponent } from "./tournaments/tournament-history/tournament-history.component";
import { LoginComponent } from "./auth/login/login.component";
import { UserHomeComponent } from "./auth/user-home/user-home.component";
import { RulesComponent } from "./rules/rules.component";
import { HandicapsComponent } from "./handicaps/handicaps.component";
import { GolferSearchComponent } from "./golfers/golfer-search/golfer-search.component";
import { PaymentsListComponent } from "./payments/payments-list/payments-list.component";
import { BylawsComponent } from "./bylaws/bylaws.component";
import { AddQualifyingScoreComponent } from "./golfers/add-qualifying-score/add-qualifying-score.component";

const routes: Routes = [
  { path: "", component: LeagueHomeComponent },
  { path: "flight", component: FlightHomeComponent},
  { path: "flight/team", component: TeamHomeComponent },
  { path: "flight/signup", component: FlightSignupComponent},
  { path: "flight/history", component: FlightHistoryComponent },
  {
    path: "flight/match/edit",
    component: FlightMatchCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "payments",
    component: PaymentsListComponent,
    canActivate: [AuthGuard]
  },
  { path: "tournament", component: TournamentHomeComponent },
  { path: "tournament/history", component: TournamentHistoryComponent },
  { path: "golfer", component: GolferHomeComponent },
  { path: "golfer/search", component: GolferSearchComponent },
  {
    path: "golfer/qualifying",
    component: AddQualifyingScoreComponent,
    // canActivate: [AuthGuard]
  },
  { path: "courses", component: CourseListComponent },
  { path: "courses/edit", component: CourseCreateComponent },
  { path: "auth/login", component: LoginComponent },
  {
    path: "auth/user",
    component: UserHomeComponent,
    canActivate: [AuthGuard]
  },
  { path: "rules", component: RulesComponent },
  { path: "handicaps", component: HandicapsComponent },
  { path: "bylaws", component: BylawsComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
