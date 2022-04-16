import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { environment } from './../../environments/environment';
import { Course } from "../shared/course.model"
import { Tee } from "../shared/tee.model";

@Injectable({
  providedIn: "root"
})
export class CoursesService {
  private courses: Course[] = [];
  private coursesUpdated = new Subject<{ courses: Course[], courseCount: number }>();

  private selectedCourse: Course;
  private selectedCourseUpdated = new Subject<Course>();

  private selectedTee: Tee
  private selectedTeeUpdated = new Subject<Tee>();

  constructor(private http: HttpClient, private router: Router) {}

  getCourses(): void {
    this.http.get<Course[]>(environment.apiUrl + "courses/")
      .subscribe(coursesData => {
        this.courses = coursesData;
        this.coursesUpdated.next({
          courses: [...this.courses],
          courseCount: this.courses.length
        });
      });
  }

  getCoursesUpdateListener() : Observable<{ courses: Course[], courseCount: number }> {
    return this.coursesUpdated.asObservable();
  }

  getCourse(id: number): void {
    this.http.get<Course>(environment.apiUrl + "courses/" + id)
      .subscribe(courseData => {
        this.selectedCourse = courseData;
        this.selectedCourseUpdated.next(courseData);
      })
  }

  getSelectedCourseUpdateListener(): Observable<Course> {
    return this.selectedCourseUpdated.asObservable();
  }

  addCourse(courseData: Course): void {
    this.http.post<{ message: string, course: Course }>(environment.apiUrl + "courses/", courseData)
      .subscribe(responseData => {
        console.log("[CoursesService] Added course: " + courseData.name + " (" + courseData.year + ")");
        this.router.navigate(["courses/"]);
      });
  }

  getTee(id: number): void {
    this.http.get<Tee>(environment.apiUrl + `courses/tees/${id}`).subscribe(teeData => {
      this.selectedTee = teeData;
      this.selectedTeeUpdated.next(teeData);
    });
  }

  getSelectedTeeUpdated(): Observable<Tee> {
    return this.selectedTeeUpdated.asObservable();
  }

}
