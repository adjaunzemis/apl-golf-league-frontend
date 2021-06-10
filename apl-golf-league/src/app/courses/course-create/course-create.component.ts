import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { GolfCourse } from "src/app/shared/golf-course.model";
import { GolfTeeSet } from "src/app/shared/golf-tee-set.model";
import { GolfTrack } from "src/app/shared/golf-track.model";
import { CoursesService } from "../courses.service";

@Component({
    selector: "app-course-create",
    templateUrl: "./course-create.component.html",
    styleUrls: ["./course-create.component.css"]
})
export class CourseCreateComponent implements OnInit, OnDestroy {
    courseForm: FormGroup;

    course: GolfCourse;
    private coursesSub: Subscription;

    constructor(private coursesService: CoursesService, private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.coursesSub = this.coursesService.getCourseUpdateListener()
          .subscribe((courseData: { courses: GolfCourse[], courseCount: number }) => {
            // this.course = courseData.courses[0];
          });

        this.courseForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            abbreviation: new FormControl("", Validators.required),
            address: new FormControl(""),
            city: new FormControl(""),
            state: new FormControl(""),
            zipCode: new FormControl(""),
            phone: new FormControl(""),
            website: new FormControl(""),
            tracks: this.formBuilder.array([])
        });
    }

    ngOnDestroy(): void {
        this.coursesSub.unsubscribe();
    }

    onLoadCourse(): void {
        this.coursesService.getCourses();
    }

    onSubmitCourse(): void {
        console.log(this.courseForm.value)
        if (this.courseForm.valid) {
            const course: GolfCourse = {
                id: -1,
                name: this.courseForm.value.name,
                abbreviation: this.courseForm.value.abbreviation,
                address: this.courseForm.value.address,
                city: this.courseForm.value.city,
                state: this.courseForm.value.state,
                zipCode: this.courseForm.value.zipCode,
                phone: this.courseForm.value.phone,
                website: this.courseForm.value.website,
                tracks: []
            };

            for (let trIdx = 0; trIdx < this.courseForm.value.tracks.length; trIdx++) {
                const trackForm = this.courseForm.value.tracks[trIdx];
                const track: GolfTrack = {
                    id: -1,
                    courseId: -1,
                    name: trackForm.name,
                    abbreviation: trackForm.abbreviation,
                    teeSets: []
                };

                for (let tsIdx = 0; tsIdx < trackForm.teeSets.length; tsIdx++) {
                    const teeSetForm = trackForm.teeSets[tsIdx];
                    const teeSet: GolfTeeSet = {
                        id: -1,
                        trackId: -1,
                        name: teeSetForm.name,
                        color: teeSetForm.color,
                        gender: teeSetForm.gender,
                        rating: teeSetForm.rating,
                        slope: teeSetForm.slope
                    };

                    track.teeSets?.push(teeSet);
                }

                course.tracks?.push(track);
            }

            console.log("Adding course: " + course.name);
            console.log(course);

            // TODO: validate entries and connect to database to add course data

            // this.onClearCourse(form);
        }
    }

    onClearCourse(): void {
        this.courseForm.reset();
    }

    getTracksArray(): FormArray {
        return (this.courseForm.get('tracks') as FormArray);
    }

    private createTrackForm(): FormGroup {
        return this.formBuilder.group({
            name: new FormControl("", Validators.required),
            abbreviation: new FormControl("", Validators.required),
            teeSets: this.formBuilder.array([])
        });
    }

    onAddTrack(): void {
        this.getTracksArray().push(this.createTrackForm());
    }

    onRemoveTrack(trIdx: number): void {
        this.getTracksArray().removeAt(trIdx);
    }

    getTeeSetsArray(trIdx: number): FormArray {
        return (this.getTracksArray().at(trIdx).get('teeSets') as FormArray);
    }

    private createTeeSetForm(): FormGroup {
        return this.formBuilder.group({
            name: new FormControl("", Validators.required),
            color: new FormControl("", Validators.required),
            gender: new FormControl("", Validators.required),
            rating: new FormControl("", Validators.required),
            slope: new FormControl("", Validators.required)
        })
    }

    onAddTeeSet(trIdx: number): void {
        this.getTeeSetsArray(trIdx).push(this.createTeeSetForm());
    }

    onRemoveTeeSet(trIdx: number, tsIdx: number): void {
        this.getTeeSetsArray(trIdx).removeAt(tsIdx);
    }
}
