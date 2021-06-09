import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { GolfCourse } from "src/app/shared/golf-course.model";
import { GolfTrack } from 'src/app/shared/golf-track.model';
import { GolfTeeSet } from '../../shared/golf-tee-set.model';
import { CoursesService } from "../courses.service";

@Component({
    selector: "app-course-create",
    templateUrl: "./course-create.component.html",
    styleUrls: ["./course-create.component.css"]
})
export class CourseCreateComponent implements OnInit, OnDestroy {
    course: GolfCourse = {
        id: -1,
        name: "",
        abbreviation: ""
    }
    private coursesSub: Subscription;

    constructor(private coursesService: CoursesService) {}

    ngOnInit(): void {
        this.coursesSub = this.coursesService.getCourseUpdateListener()
          .subscribe((courseData: { courses: GolfCourse[], courseCount: number }) => {
            this.course = courseData.courses[0];
          });
        this.coursesService.getCourses();
    }

    ngOnDestroy(): void {
        this.coursesSub.unsubscribe();
    }

    onSubmitCourse(form: NgForm): void {
        console.log(form.value)
        if (form.valid) {
            console.log("Adding course: " + form.value.courseName);

            // TODO: validate entries and connect to database to add course data

            this.onClearCourse(form);
        }
    }

    onClearCourse(form: NgForm): void {
        this.course.tracks = [];
        form.reset();
    }

    onAddTrack(): void {
        const newTrack: GolfTrack = {
            id: -1,
            courseId: this.course.id,
            name: "",
            abbreviation: ""
        };
        if (!this.course.tracks) {
            this.course.tracks = [];
        }
        this.course.tracks.push(newTrack);
    }

    onRemoveTrack(trackToRemove: GolfTrack): void {
        if (this.course.tracks) {
            const trackIndex = this.course.tracks?.findIndex((track) => {
                return track === trackToRemove;
            });
            if (trackIndex > -1) {
                this.course.tracks.splice(trackIndex, 1);
            }
        }
    }

    onAddTeeSet(track: GolfTrack): void {
        let trackData = this.course.tracks?.find((t) => {
            return t === track;
        });
        if (trackData) {
            const newTeeSet: GolfTeeSet = {
                id: -1,
                trackId: track.id,
                name: "",
                color: "",
                gender: "",
                rating: -1,
                slope: -1
            };
            if (!trackData.teeSets) {
                trackData.teeSets = [];
            }
            trackData.teeSets.push(newTeeSet);
        }
    }

    onRemoveTeeSet(teeSetToRemove: GolfTeeSet): void {
        this.course.tracks?.forEach((track) => {
            if (track.teeSets) {
                const teeSetIndex = track.teeSets.findIndex((teeSet) => {
                    return teeSet === teeSetToRemove;
                });
                if (teeSetIndex > -1) {
                    track.teeSets.splice(teeSetIndex, 1);
                }
            }
        });
    }
}
