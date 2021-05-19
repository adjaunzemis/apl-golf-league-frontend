import { Component, OnInit } from '@angular/core';

import { GolfCourse } from './../shared/golf-models';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  selectedCourse: GolfCourse;

  constructor() { }

  ngOnInit(): void {
  }

}
