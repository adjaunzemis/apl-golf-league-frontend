import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { CourseListComponent } from "./course-list/course-list.component";
import { CourseScorecardComponent } from "./course-scorecard/course-scorecard.component";

@NgModule({
  declarations: [
    CourseListComponent,
    CourseScorecardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class CoursesModule {}
