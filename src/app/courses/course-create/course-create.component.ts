import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/notifications/notification.service';
import { CoursesService } from '../courses.service';
import { Course, CourseData } from 'src/app/shared/course.model';
import { TeeData } from 'src/app/shared/tee.model';
import { TrackData } from 'src/app/shared/track.model';
import { HoleData } from 'src/app/shared/hole.model';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css'],
  standalone: false,
})
export class CourseCreateComponent implements OnInit, OnDestroy {
  isLoadingCourse = false;

  courseForm: UntypedFormGroup;

  course: Course;
  private coursesSub: Subscription;

  private readonly NUM_HOLES_PER_TEE_SET = 9;

  readonly TEE_GENDER_OPTIONS = ["Men's", "Ladies'"];

  private coursesService = inject(CoursesService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(UntypedFormBuilder);

  ngOnInit(): void {
    this.coursesSub = this.coursesService
      .getSelectedCourseUpdateListener()
      .subscribe((courseData) => {
        console.log(
          "[CourseCreateComponent] Initializing forms for course '" +
            courseData.name +
            "' (id=" +
            courseData.id +
            ')',
        );
        this.course = courseData;
        this.initFormsFromCourse(this.course);
        this.isLoadingCourse = false;
      });

    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.id) {
          console.log(
            '[CourseCreateComponent] Processing route with query parameter: id=' + params.id,
          );
          this.isLoadingCourse = true;
          this.coursesService.getCourse(params.id);
        }
      }
    });

    this.courseForm = this.createCourseForm();
  }

  private createCourseForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: new UntypedFormControl('', Validators.required),
      year: new UntypedFormControl('', Validators.required),
      address: new UntypedFormControl(''),
      phone: new UntypedFormControl(''),
      website: new UntypedFormControl(''),
      tracks: this.formBuilder.array([]),
    });
  }

  initFormsFromCourse(course: Course): void {
    const courseData = {
      name: course.name,
      year: course.year,
      address: course.address,
      phone: course.phone,
      website: course.website,
      tracks: [] as {
        name: string;
        tees: {
          name: string;
          color: string;
          gender: string;
          rating: number;
          slope: number;
          holes: { number: number; par: number; stroke_index?: number; yardage?: number }[];
        }[];
      }[],
    };

    if (course.tracks) {
      for (let trIdx = 0; trIdx < course.tracks.length; trIdx++) {
        this.onAddTrack();

        const track = course.tracks[trIdx];
        courseData.tracks.push({
          name: track.name,
          tees: [] as {
            name: string;
            color: string;
            gender: string;
            rating: number;
            slope: number;
            holes: { number: number; par: number; stroke_index?: number; yardage?: number }[];
          }[],
        });

        if (track.tees) {
          for (let tsIdx = 0; tsIdx < track.tees.length; tsIdx++) {
            this.onAddTee(trIdx, false);

            const tee = track.tees[tsIdx];
            courseData.tracks[trIdx].tees.push({
              name: tee.name,
              color: tee.color,
              gender: tee.gender,
              rating: tee.rating,
              slope: tee.slope,
              holes: [] as {
                number: number;
                par: number;
                stroke_index?: number;
                yardage?: number;
              }[],
            });

            if (tee.holes) {
              for (let hIdx = 0; hIdx < tee.holes.length; hIdx++) {
                this.onAddHole(trIdx, tsIdx, hIdx + 1);

                const hole = tee.holes[hIdx];
                courseData.tracks[trIdx].tees[tsIdx].holes.push({
                  number: hole.number,
                  par: hole.par,
                  stroke_index: hole.stroke_index,
                  yardage: hole.yardage,
                });
              }
            }
          }
        }
      }
    }

    this.courseForm.setValue(courseData);
  }

  ngOnDestroy(): void {
    this.coursesSub.unsubscribe();
  }

  onSubmitCourse(): void {
    if (this.courseForm.valid) {
      const courseData: CourseData = {
        name: this.courseForm.value.name,
        year: this.courseForm.value.year,
        address: this.courseForm.value.address,
        phone: this.courseForm.value.phone,
        website: this.courseForm.value.website,
        tracks: [],
      };

      for (const trackForm of this.courseForm.value.tracks) {
        const track: TrackData = {
          name: trackForm.name,
          tees: [],
        };

        for (const teeForm of trackForm.tees) {
          const tee: TeeData = {
            name: teeForm.name,
            color: teeForm.color,
            gender: teeForm.gender,
            rating: +teeForm.rating,
            slope: +teeForm.slope,
            holes: [],
          };

          for (const holeForm of teeForm.holes) {
            const hole: HoleData = {
              number: +holeForm.number,
              par: +holeForm.par,
              stroke_index: +holeForm.stroke_index,
              yardage: +holeForm.yardage,
            };

            tee.holes?.push(hole);
          }

          track.tees?.push(tee);
        }

        courseData.tracks?.push(track);
      }

      // Push course to database
      if (this.course === undefined) {
        // Create new course
        this.coursesService.createCourse(courseData).subscribe((courseResponse) => {
          this.notificationService.showSuccess(
            'Course Created',
            `Successfully created course: ${courseResponse.name} (${courseResponse.year})`,
            5000,
          );
          this.router.navigate(['courses/']);
        });
      } else {
        // Add ids to course data
        courseData.id = this.course.id;
        for (const trackData of courseData.tracks) {
          trackData.course_id = courseData.id;
          const trackMatches = this.course.tracks.filter((track) => track.name === trackData.name);
          for (const trackMatch of trackMatches) {
            trackData.id = trackMatch.id;

            for (const teeData of trackData.tees) {
              teeData.track_id = trackData.id;
              const teeMatches = trackMatch.tees.filter(
                (tee) => tee.name === teeData.name && tee.gender === teeData.gender,
              );
              for (const teeMatch of teeMatches) {
                teeData.id = teeMatch.id;

                for (const holeData of teeData.holes) {
                  holeData.tee_id = teeData.id;
                  const holeMatches = teeMatch.holes.filter(
                    (hole) => hole.number === holeData.number,
                  );
                  for (const holeMatch of holeMatches) {
                    holeData.id = holeMatch.id;
                  }
                }
              }
            }
          }
        }

        // Update existing course
        this.coursesService.updateCourse(courseData).subscribe((courseResponse) => {
          this.notificationService.showSuccess(
            'Course Updated',
            `Successfully updated course: ${courseResponse.name} (${courseResponse.year})`,
            5000,
          );
          this.router.navigate(['courses/']);
        });
      }
    }
  }

  onClearCourse(): void {
    this.courseForm.reset();
  }

  getTracksArray(): UntypedFormArray {
    return this.courseForm.get('tracks') as UntypedFormArray;
  }

  private createTrackForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: new UntypedFormControl('', Validators.required),
      tees: this.formBuilder.array([]),
    });
  }

  onAddTrack(): void {
    this.getTracksArray().push(this.createTrackForm());
  }

  onRemoveTrack(trIdx: number): void {
    this.getTracksArray().removeAt(trIdx);
    this.course?.tracks.splice(trIdx, 1);
  }

  getTeesArray(trIdx: number): UntypedFormArray {
    return this.getTracksArray().at(trIdx).get('tees') as UntypedFormArray;
  }

  private createTeeForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: new UntypedFormControl('', Validators.required),
      color: new UntypedFormControl('', Validators.required),
      gender: new UntypedFormControl('', Validators.required),
      rating: new UntypedFormControl('', Validators.required),
      slope: new UntypedFormControl('', Validators.required),
      holes: this.formBuilder.array([]),
    });
  }

  onAddTee(trIdx: number, addDefaultHoles: boolean): void {
    this.getTeesArray(trIdx).push(this.createTeeForm());

    if (addDefaultHoles) {
      const tsIdx = this.getTeesArray(trIdx).length - 1;
      for (let hIdx = 0; hIdx < this.NUM_HOLES_PER_TEE_SET; hIdx++) {
        this.onAddHole(trIdx, tsIdx, hIdx + 1);
      }
    }
  }

  onRemoveTee(trIdx: number, tsIdx: number): void {
    this.getTeesArray(trIdx).removeAt(tsIdx);
    this.course?.tracks[trIdx].tees.splice(tsIdx, 1);
  }

  getHolesArray(trIdx: number, tsIdx: number): UntypedFormArray {
    return this.getTeesArray(trIdx).at(tsIdx).get('holes') as UntypedFormArray;
  }

  private createHoleForm(holeNum: number): UntypedFormGroup {
    return this.formBuilder.group({
      number: new UntypedFormControl(holeNum, Validators.required),
      par: new UntypedFormControl('', Validators.required),
      stroke_index: new UntypedFormControl('', Validators.required),
      yardage: new UntypedFormControl('', Validators.required),
    });
  }

  onAddHole(trIdx: number, tsIdx: number, holeNum: number): void {
    this.getHolesArray(trIdx, tsIdx).push(this.createHoleForm(holeNum));
  }
}
