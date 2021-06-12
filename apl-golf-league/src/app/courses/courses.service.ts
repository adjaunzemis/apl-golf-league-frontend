import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { GolfCourse } from "../shared/golf-course.model"
import { environment } from './../../environments/environment';

const API_COURSES_ENDPOINT = environment.apiUrl + "/courses";

@Injectable({
  providedIn: "root"
})
export class CoursesService {
  private courses: GolfCourse[] = [];
  private coursesUpdated = new Subject<{ courses: GolfCourse[], courseCount: number }>();

  private selectedCourse: GolfCourse;
  private selectedCourseUpdated = new Subject<GolfCourse>();

  constructor(private http: HttpClient) {}

  getCourses(): void {
    this.http.get<GolfCourse[]>(API_COURSES_ENDPOINT)
      .subscribe(coursesData => {
        this.courses = coursesData;
        this.coursesUpdated.next({
          courses: [...this.courses],
          courseCount: this.courses.length
        });
      });
  }

  getCourseUpdateListener() : Observable<{ courses: GolfCourse[], courseCount: number }> {
    return this.coursesUpdated.asObservable();
  }

  getCourse(id: number): void {
    this.http.get<GolfCourse[]>(API_COURSES_ENDPOINT + "?id=" + id)
      .subscribe(courseData => {
        if (courseData.length > 0) {
          this.selectedCourse = courseData[0];
          this.selectedCourseUpdated.next(courseData[0]);
        }
      })
  }

  getSelectedCourseUpdateListener(): Observable<GolfCourse> {
    return this.selectedCourseUpdated.asObservable();
  }

}
