import { Component, Input, OnInit } from '@angular/core';

import { GolfCourse } from './../../shared/golf-models';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  @Input() course: GolfCourse;

  constructor() { }

  ngOnInit(): void {
  }

}
