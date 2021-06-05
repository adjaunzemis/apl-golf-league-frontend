import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { CourseListComponent } from "./courses/course-list/course-list.component";
import { CreateCourseComponent } from "./courses/create-course/create-course.component";

const routes: Routes = [
  { path: "", component: CreateCourseComponent },
  { path: "flights", component: AppComponent },
  { path: "tournaments", component: AppComponent },
  { path: "courses", component: CourseListComponent },
  { path: "players", component: AppComponent },
  { path: "teams", component: AppComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
