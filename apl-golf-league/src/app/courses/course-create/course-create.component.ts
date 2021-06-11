import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
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

    @Input() course: GolfCourse;
    private coursesSub: Subscription;

    constructor(private coursesService: CoursesService, private route: ActivatedRoute, private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.coursesSub = this.coursesService.getCourseUpdateListener()
            .subscribe((courseData: { courses: GolfCourse[], courseCount: number }) => {
                this.course = courseData.courses[0];
                this.initFormsFromCourse(this.course);
            });
            
        this.route.queryParams.subscribe(params => {
            console.log(params);
            if (params) {
                const courseName = params.name;
                console.log(courseName);

                this.coursesService.getCourses();
            }
        });

        this.courseForm = this.createCourseForm();
    }

    private createCourseForm(): FormGroup {
        return this.formBuilder.group({
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

    initFormsFromCourse(course: GolfCourse): void {
        const courseData = {
            name: course.name,
            abbreviation: course.abbreviation,
            address: course.address,
            city: course.city,
            state: course.state,
            zipCode: course.zipCode,
            phone: course.phone,
            website: course.website,
            tracks: [] as { name: string, abbreviation: string, teeSets: { name: string, color: string, gender: string, rating: number, slope: number, holes: { number: number, par: number, handicap: number, yardage: number }[] }[] }[]
        };

        if (course.tracks) {
            for (let trIdx = 0; trIdx < course.tracks.length; trIdx++) {
                this.onAddTrack();

                const track = course.tracks[trIdx];
                courseData.tracks.push({
                    name: track.name,
                    abbreviation: track.abbreviation,
                    teeSets: [] as { name: string, color: string, gender: string, rating: number, slope: number, holes: { number: number, par: number, handicap: number, yardage: number }[] }[]
                });

                if (track.teeSets) {
                    for (let tsIdx = 0; tsIdx < track.teeSets.length; tsIdx++) {
                        this.onAddTeeSet(trIdx);

                        const teeSet = track.teeSets[tsIdx];
                        courseData.tracks[trIdx].teeSets.push({
                            name: teeSet.name,
                            color: teeSet.color,
                            gender: teeSet.gender,
                            rating: teeSet.rating,
                            slope: teeSet.slope,
                            holes: [] as { number: number, par: number, handicap: number, yardage: number }[]
                        });

                        if (teeSet.holes) {
                            for (let hIdx = 0; hIdx < teeSet.holes.length; hIdx++) {
                                this.onAddHole(trIdx, tsIdx);
    
                                const hole = teeSet.holes[hIdx];
                                courseData.tracks[trIdx].teeSets[tsIdx].holes.push({
                                    number: hole.number,
                                    par: hole.par,
                                    handicap: hole.handicap,
                                    yardage: hole.yardage
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

            // TODO: Redirect back to courses list
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
            slope: new FormControl("", Validators.required),
            holes: this.formBuilder.array([])
        });
    }

    onAddTeeSet(trIdx: number): void {
        this.getTeeSetsArray(trIdx).push(this.createTeeSetForm());
    }

    onRemoveTeeSet(trIdx: number, tsIdx: number): void {
        this.getTeeSetsArray(trIdx).removeAt(tsIdx);
    }

    getHolesArray(trIdx: number, tsIdx: number): FormArray {
        return (this.getTeeSetsArray(trIdx).at(tsIdx).get('holes') as FormArray);
    }

    private createHoleForm(): FormGroup {
        return this.formBuilder.group({
            number: new FormControl("", Validators.required),
            par: new FormControl("", Validators.required),
            handicap: new FormControl("", Validators.required),
            yardage: new FormControl("", Validators.required)
        });
    }

    onAddHole(trIdx: number, tsIdx: number): void {
        this.getHolesArray(trIdx, tsIdx).push(this.createHoleForm());
    }
}
