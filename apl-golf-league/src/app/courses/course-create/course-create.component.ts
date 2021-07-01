import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { CoursesService } from "../courses.service";
import { GolfCourse } from "src/app/shared/golf-course.model";
import { GolfTeeSet } from "src/app/shared/golf-tee-set.model";
import { GolfTrack } from "src/app/shared/golf-track.model";
import { GolfHole } from "src/app/shared/golf-hole.model";

@Component({
    selector: "app-course-create",
    templateUrl: "./course-create.component.html",
    styleUrls: ["./course-create.component.css"]
})
export class CourseCreateComponent implements OnInit, OnDestroy {
    courseForm: FormGroup;

    course: GolfCourse;
    private coursesSub: Subscription;

    private readonly NUM_HOLES_PER_TEE_SET = 9;

    constructor(private coursesService: CoursesService, private route: ActivatedRoute, private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.coursesSub = this.coursesService.getSelectedCourseUpdateListener()
            .subscribe(courseData => {
                console.log("[CourseCreateComponent] Initializing forms for course '" + courseData.name + "' (id=" + courseData.id + ")");
                this.course = courseData;
                this.initFormsFromCourse(this.course);
            });

        this.route.queryParams.subscribe(params => {
            if (params) {
                if (params.id) {
                    console.log("[CourseCreateComponent] Processing route with query parameter: id=" + params.id);
                    this.coursesService.getCourse(params.id);
                }
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
                        this.onAddTeeSet(trIdx, false);

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
                                this.onAddHole(trIdx, tsIdx, hIdx + 1);

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
                zipCode: +this.courseForm.value.zipCode,
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
                        rating: +teeSetForm.rating,
                        slope: +teeSetForm.slope,
                        holes: []
                    };

                    for (let hIdx = 0; hIdx < teeSetForm.holes.length; hIdx++) {
                        const holeForm = teeSetForm.holes[hIdx];
                        const hole: GolfHole = {
                            id: -1,
                            teeSetId: -1,
                            number: +holeForm.number,
                            par: +holeForm.par,
                            handicap: +holeForm.handicap,
                            yardage: +holeForm.yardage
                        }

                        teeSet.holes?.push(hole);
                    }

                    track.teeSets?.push(teeSet);
                }

                course.tracks?.push(track);
            }

            // TODO: Validate course entries here? Or in service?

            // Add to database
            this.coursesService.addCourse(course);
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

    onAddTeeSet(trIdx: number, addDefaultHoles: boolean): void {
        this.getTeeSetsArray(trIdx).push(this.createTeeSetForm());

        if (addDefaultHoles) {
            const tsIdx = this.getTeeSetsArray(trIdx).length - 1;
            for (let hIdx = 0; hIdx < this.NUM_HOLES_PER_TEE_SET; hIdx++) {
                this.onAddHole(trIdx, tsIdx, hIdx + 1);
            }
        }
    }

    onRemoveTeeSet(trIdx: number, tsIdx: number): void {
        this.getTeeSetsArray(trIdx).removeAt(tsIdx);
    }

    getHolesArray(trIdx: number, tsIdx: number): FormArray {
        return (this.getTeeSetsArray(trIdx).at(tsIdx).get('holes') as FormArray);
    }

    private createHoleForm(holeNum: number): FormGroup {
        return this.formBuilder.group({
            number: new FormControl(holeNum, Validators.required),
            par: new FormControl("", Validators.required),
            handicap: new FormControl("", Validators.required),
            yardage: new FormControl("", Validators.required)
        });
    }

    onAddHole(trIdx: number, tsIdx: number, holeNum: number): void {
        this.getHolesArray(trIdx, tsIdx).push(this.createHoleForm(holeNum));
    }
}
