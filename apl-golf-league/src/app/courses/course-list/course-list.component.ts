import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Subscription } from "rxjs";

import { CoursesService } from "../courses.service";
import { GolfCourse } from "../../shared/golf-course.model";

@Component({
  selector: "app-course-list",
  templateUrl: "./course-list.component.html",
  styleUrls: ["./course-list.component.css"]
})
export class CourseListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;

  courses = new MatTableDataSource<GolfCourse>();
  private coursesSub: Subscription;

  displayedColumns = ['name', 'address', 'city', 'state', 'zipCode', 'phone', 'website'];
  @ViewChild(MatSort) sort: MatSort;

  totalCourses = 0;
  coursesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.coursesSub = this.coursesService.getCourseUpdateListener()
      .subscribe((courseData: { courses: GolfCourse[], courseCount: number }) => {
        this.isLoading = false;
        this.courses = new MatTableDataSource<GolfCourse>(courseData.courses);
        this.totalCourses = courseData.courseCount;
      });
    this.coursesService.getCourses();
  }

  ngAfterViewInit(): void {
    this.courses.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.coursesSub.unsubscribe();
  }

  doFilter = (event: Event) => {
    const target = <HTMLInputElement> event.target;
    this.courses.filter = target.value.trim().toLocaleLowerCase();
  }

}
