import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseScorecardComponent } from './course-scorecard/course-scorecard.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { PrimeNGModule } from '../primeng.module';

@NgModule({
  declarations: [CourseListComponent, CourseScorecardComponent, CourseCreateComponent],
  imports: [CommonModule, FormsModule, RouterModule, AngularMaterialModule, ScorecardModule, PrimeNGModule],
})
export class CoursesModule {}
