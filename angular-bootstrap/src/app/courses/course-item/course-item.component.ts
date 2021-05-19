import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { GolfCourse } from 'src/app/shared/golf-models';

@Component({
  selector: 'app-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.css']
})
export class CourseItemComponent implements OnInit {
  @Input() course: GolfCourse;
  @Output() courseSelected = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onSelected(): void {
    this.courseSelected.emit();
  }
}
