import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { GolfCourse } from './../../shared/golf-models';
import { MOCK_COURSE, TIMBERS_FRONT_COURSE, WOODHOLME_FRONT_COURSE } from './../../shared/mock-data';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  @Output() courseWasSelected = new EventEmitter<GolfCourse>();
  courses: GolfCourse[] = [
    MOCK_COURSE,
    TIMBERS_FRONT_COURSE,
    WOODHOLME_FRONT_COURSE
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onCourseSelected(course: GolfCourse) {
    this.courseWasSelected.emit(course);
  }

}
