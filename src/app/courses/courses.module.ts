import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CourseScorecardComponent } from './course-scorecard/course-scorecard.component';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';

@NgModule({
  declarations: [CourseScorecardComponent],
  imports: [CommonModule, RouterModule, ScorecardModule],
})
export class CoursesModule {}
