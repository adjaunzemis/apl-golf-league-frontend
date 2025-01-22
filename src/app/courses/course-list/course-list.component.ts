import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

import { CoursesService } from '../courses.service';
import { Course } from '../../shared/course.model';
import { Tee } from '../../shared/tee.model';
import { Hole } from '../../shared/hole.model';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: false,
})
export class CourseListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;

  courses = new MatTableDataSource<Course>();
  expandedCourse: Course | null;
  private coursesSub: Subscription;

  columnsToDisplay = ['name', 'year', 'address', 'phone', 'website'];
  @ViewChild(MatSort) sort: MatSort;

  totalCourses = 0;
  coursesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.coursesSub = this.coursesService
      .getCoursesUpdateListener()
      .subscribe((courseData: { courses: Course[]; courseCount: number }) => {
        this.isLoading = false;
        this.courses = new MatTableDataSource<Course>(courseData.courses);
        this.totalCourses = courseData.courseCount;
      });
    this.coursesService.getCourses(false);
  }

  ngAfterViewInit(): void {
    this.courses.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.coursesSub.unsubscribe();
  }

  onShowInactiveCoursesChange(e: MatCheckboxChange) {
    this.isLoading = true;
    this.coursesService.getCourses(e.checked);
  }

  doFilter = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.courses.filter = target.value.trim().toLocaleLowerCase();
  };

  computeTeePar(tee: Tee): number {
    if (!tee.holes) {
      return -1;
    }
    return tee.holes.reduce(function (prev: number, cur: Hole) {
      return prev + cur.par;
    }, 0);
  }

  computeTeeYardage(tee: Tee): number {
    if (!tee.holes) {
      return -1;
    }
    return tee.holes.reduce(function (prev: number, cur: Hole) {
      return cur.yardage ? prev + cur.yardage : 0;
    }, 0);
  }
}
