import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { RoundListComponent } from './rounds/round-list/round-list.component';
import { RoundDetailComponent } from './rounds/round-detail/round-detail.component';
import { RoundsComponent } from './rounds/rounds.component';
import { RoundItemComponent } from './rounds/round-item/round-item.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseItemComponent } from './courses/course-item/course-item.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ScorecardComponent,
    RoundListComponent,
    RoundDetailComponent,
    RoundsComponent,
    RoundItemComponent,
    CoursesComponent,
    CourseListComponent,
    CourseItemComponent,
    CourseDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
