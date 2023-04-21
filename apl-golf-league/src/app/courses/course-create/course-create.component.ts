import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { CoursesService } from "../courses.service";
import { Course } from "src/app/shared/course.model";
import { Tee } from "src/app/shared/tee.model";
import { Track } from "src/app/shared/track.model";
import { Hole } from "src/app/shared/hole.model";

@Component({
    selector: "app-course-create",
    templateUrl: "./course-create.component.html",
    styleUrls: ["./course-create.component.css"]
})
export class CourseCreateComponent implements OnInit, OnDestroy {
    isLoadingCourse = false;

    courseForm: FormGroup;

    course: Course;
    private coursesSub: Subscription;

    private readonly NUM_HOLES_PER_TEE_SET = 9;

    readonly TEE_GENDER_OPTIONS = ["Men's", "Ladies'"];

    constructor(private coursesService: CoursesService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.coursesSub = this.coursesService.getSelectedCourseUpdateListener()
            .subscribe(courseData => {
                console.log("[CourseCreateComponent] Initializing forms for course '" + courseData.name + "' (id=" + courseData.id + ")");
                this.course = courseData;
                this.initFormsFromCourse(this.course);
                this.isLoadingCourse = false;
            });

        this.route.queryParams.subscribe(params => {
            if (params) {
                if (params.id) {
                    console.log("[CourseCreateComponent] Processing route with query parameter: id=" + params.id);
                    this.isLoadingCourse = true;
                    this.coursesService.getCourse(params.id);
                }
            }
        });

        this.courseForm = this.createCourseForm();
    }

    private createCourseForm(): FormGroup {
        return this.formBuilder.group({
            name: new FormControl("", Validators.required),
            year: new FormControl("", Validators.required),
            address: new FormControl(""),
            phone: new FormControl(""),
            website: new FormControl(""),
            tracks: this.formBuilder.array([])
        });
    }

    initFormsFromCourse(course: Course): void {
        const courseData = {
            name: course.name,
            year: course.year,
            address: course.address,
            phone: course.phone,
            website: course.website,
            tracks: [] as { name: string, tees: { name: string, color: string, gender: string, rating: number, slope: number, holes: { number: number, par: number, stroke_index?: number, yardage?: number }[] }[] }[]
        };

        if (course.tracks) {
            for (let trIdx = 0; trIdx < course.tracks.length; trIdx++) {
                this.onAddTrack();

                const track = course.tracks[trIdx];
                courseData.tracks.push({
                    name: track.name,
                    tees: [] as { name: string, color: string, gender: string, rating: number, slope: number, holes: { number: number, par: number, stroke_index?: number, yardage?: number }[] }[]
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
                            holes: [] as { number: number, par: number, stroke_index?: number, yardage?: number }[]
                        });

                        if (tee.holes) {
                            for (let hIdx = 0; hIdx < tee.holes.length; hIdx++) {
                                this.onAddHole(trIdx, tsIdx, hIdx + 1);

                                const hole = tee.holes[hIdx];
                                courseData.tracks[trIdx].tees[tsIdx].holes.push({
                                    number: hole.number,
                                    par: hole.par,
                                    stroke_index: hole.stroke_index,
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
        if (this.courseForm.valid) {
            const course: Course = {
                id: -1,
                name: this.courseForm.value.name,
                year: this.courseForm.value.year,
                address: this.courseForm.value.address,
                phone: this.courseForm.value.phone,
                website: this.courseForm.value.website,
                tracks: []
            };

            for (let trIdx = 0; trIdx < this.courseForm.value.tracks.length; trIdx++) {
                const trackForm = this.courseForm.value.tracks[trIdx];
                const track: Track = {
                    id: -1,
                    course_id: -1,
                    name: trackForm.name,
                    tees: []
                };

                for (let tsIdx = 0; tsIdx < trackForm.tees.length; tsIdx++) {
                    const teeForm = trackForm.tees[tsIdx];
                    const tee: Tee = {
                        id: -1,
                        track_id: -1,
                        name: teeForm.name,
                        color: teeForm.color,
                        gender: teeForm.gender,
                        rating: +teeForm.rating,
                        slope: +teeForm.slope,
                        holes: []
                    };

                    for (let hIdx = 0; hIdx < teeForm.holes.length; hIdx++) {
                        const holeForm = teeForm.holes[hIdx];
                        const hole: Hole = {
                            id: -1,
                            tee_id: -1,
                            number: +holeForm.number,
                            par: +holeForm.par,
                            stroke_index: +holeForm.stroke_index,
                            yardage: +holeForm.yardage
                        }

                        tee.holes?.push(hole);
                    }

                    track.tees?.push(tee);
                }

                course.tracks?.push(track);
            }

            // TODO: Validate course entries here? Or in service?

            // Add to database
            this.coursesService.createCourse(course).subscribe(response => {
              console.log("[CourseCreateComponent] Added course: " + response.course.name + " (" + response.course.year + ")");
              this.router.navigate(["courses/"]);
            });
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
            tees: this.formBuilder.array([])
        });
    }

    onAddTrack(): void {
        this.getTracksArray().push(this.createTrackForm());
    }

    onRemoveTrack(trIdx: number): void {
        this.getTracksArray().removeAt(trIdx);
        this.course?.tracks.splice(trIdx, 1)
    }

    getTeesArray(trIdx: number): FormArray {
        return (this.getTracksArray().at(trIdx).get('tees') as FormArray);
    }

    private createTeeForm(): FormGroup {
        return this.formBuilder.group({
            name: new FormControl("", Validators.required),
            color: new FormControl("", Validators.required),
            gender: new FormControl("", Validators.required),
            rating: new FormControl("", Validators.required),
            slope: new FormControl("", Validators.required),
            holes: this.formBuilder.array([])
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
        this.course?.tracks[trIdx].tees.splice(tsIdx, 1)
    }

    getHolesArray(trIdx: number, tsIdx: number): FormArray {
        return (this.getTeesArray(trIdx).at(tsIdx).get('holes') as FormArray);
    }

    private createHoleForm(holeNum: number): FormGroup {
        return this.formBuilder.group({
            number: new FormControl(holeNum, Validators.required),
            par: new FormControl("", Validators.required),
            stroke_index: new FormControl("", Validators.required),
            yardage: new FormControl("", Validators.required)
        });
    }

    onAddHole(trIdx: number, tsIdx: number, holeNum: number): void {
        this.getHolesArray(trIdx, tsIdx).push(this.createHoleForm(holeNum));
    }
}
