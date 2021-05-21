import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import { GolfCourse } from "../shared/golf-course.model"

@Injectable({
  providedIn: "root"
})
export class CoursesService {
  private courses: GolfCourse[] = [];
  private coursesUpdated = new Subject<{ courses: GolfCourse[], courseCount: number }>();

  getCourses(): void {
    // TODO: use http.get<GolfCourse[]>()
    this.coursesUpdated.next({
      courses: [MOCK_COURSE, MOCK_COURSE],
      courseCount: 2
    });
  }

  getCourseUpdateListener() : Observable<{ courses: GolfCourse[], courseCount: number }> {
    return this.coursesUpdated.asObservable();
  }

}

const MOCK_COURSE : GolfCourse = {
  id: 123,
  name: "Mock Course",
  abbreviation: "MC",
  city: "Mock City",
  state: "MS",
  zipCode: 12345,
  phone: "123-456-7890",
  website: "www.google.com",
  tracks: [
    {
      id: 111,
      courseId: 123,
      name: "Front",
      abbreviation: "F",
      teeSets: [
        {
          id: 0,
          trackId: 111,
          name: "White",
          color: "#00ff00",
          gender: "M",
          rating: 70.1,
          slope: 120,
          holes: [
            {
              id: 1,
              teeSetId: 0,
              number: 1,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 2,
              teeSetId: 0,
              number: 2,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 3,
              teeSetId: 0,
              number: 3,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 4,
              teeSetId: 0,
              number: 4,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 5,
              teeSetId: 0,
              number: 5,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 6,
              teeSetId: 0,
              number: 6,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 7,
              teeSetId: 0,
              number: 7,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 8,
              teeSetId: 0,
              number: 8,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 9,
              teeSetId: 0,
              number: 9,
              par: 4,
              handicap: 9,
              yardage: 395
            }
          ]
        },
        {
          id: 0,
          trackId: 111,
          name: "Blue",
          color: "#0000ff",
          gender: "M",
          rating: 72.3,
          slope: 124,
          holes: [
            {
              id: 1,
              teeSetId: 0,
              number: 1,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 2,
              teeSetId: 0,
              number: 2,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 3,
              teeSetId: 0,
              number: 3,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 4,
              teeSetId: 0,
              number: 4,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 5,
              teeSetId: 0,
              number: 5,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 6,
              teeSetId: 0,
              number: 6,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 7,
              teeSetId: 0,
              number: 7,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 8,
              teeSetId: 0,
              number: 8,
              par: 4,
              handicap: 9,
              yardage: 395
            },
            {
              id: 9,
              teeSetId: 0,
              number: 9,
              par: 4,
              handicap: 9,
              yardage: 395
            }
          ]
        }
      ]
    }
  ]
}
