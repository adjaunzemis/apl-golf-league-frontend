import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { CourseListComponent } from "./courses/course-list/course-list.component";
import { CourseCreateComponent } from "./courses/course-create/course-create.component";
import { RoundListComponent } from "./rounds/round-list/round-list.component";
import { FlightListComponent } from "./flights/flight-list/flight-list.component";
import { GolferListComponent } from "./golfers/golfer-list/golfer-list.component";

const routes: Routes = [
  { path: "", component: AppComponent },
  { path: "flights", component: FlightListComponent },
  { path: "tournaments", component: AppComponent },
  { path: "courses", component: CourseListComponent },
  { path: "courses/edit", component: CourseCreateComponent },
  { path: "golfers", component: GolferListComponent },
  { path: "rounds", component: RoundListComponent },
  { path: "teams", component: AppComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
