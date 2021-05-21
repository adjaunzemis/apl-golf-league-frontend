import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { CoursesService } from "../courses.service";
import { GolfCourse } from "../../shared/golf-course.model";

@Component({
  selector: "app-course-list",
  templateUrl: "./course-list.component.html",
  styleUrls: ["./course-list.component.css"]
})
export class CourseListComponent implements OnInit, OnDestroy {
  courses: GolfCourse[] = [];
  private coursesSub: Subscription;

  totalCourses = 0;
  coursesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.coursesSub = this.coursesService.getCourseUpdateListener()
      .subscribe((courseData: { courses: GolfCourse[], courseCount: number }) => {
        this.courses = courseData.courses;
        this.totalCourses = courseData.courseCount;
      });
    this.coursesService.getCourses();
  }

  ngOnDestroy(): void {
    this.coursesSub.unsubscribe();
  }

}
