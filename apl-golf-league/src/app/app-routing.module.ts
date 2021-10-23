import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { CourseListComponent } from "./courses/course-list/course-list.component";
import { CourseCreateComponent } from "./courses/course-create/course-create.component";
import { RoundListComponent } from "./rounds/round-list/round-list.component";

const routes: Routes = [
  { path: "", component: AppComponent },
  { path: "flights", component: RoundListComponent }, // TODO: Using for round data list temporarily
  { path: "tournaments", component: AppComponent },
  { path: "courses", component: CourseListComponent },
  { path: "courses/edit", component: CourseCreateComponent },
  { path: "players", component: AppComponent },
  { path: "teams", component: AppComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
