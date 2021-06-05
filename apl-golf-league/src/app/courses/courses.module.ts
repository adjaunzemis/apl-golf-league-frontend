import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { CourseListComponent } from "./course-list/course-list.component";
import { CourseScorecardComponent } from "./course-scorecard/course-scorecard.component";
import { CreateCourseComponent } from "./create-course/create-course.component";

@NgModule({
  declarations: [
    CourseListComponent,
    CourseScorecardComponent,
    CreateCourseComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class CoursesModule {}
