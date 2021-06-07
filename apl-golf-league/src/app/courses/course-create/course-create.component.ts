import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { GolfCourse } from "src/app/shared/golf-course.model";
import { GolfTrack } from 'src/app/shared/golf-track.model';
import { GolfTeeSet } from '../../shared/golf-tee-set.model';

@Component({
    selector: "app-course-create",
    templateUrl: "./course-create.component.html",
    styleUrls: ["./course-create.component.css"]
})
export class CourseCreateComponent {
    courseData: GolfCourse = {
        id: -1,
        name: "",
        abbreviation: ""
    }

    onAddCourse(form: NgForm): void {
        if (form.valid) {
            console.log("Adding course: " + form.value.courseName);
            this.onClearCourse(form); // TODO: validate entries and connect to database to add course data
        }
    }

    onClearCourse(form: NgForm): void {
        this.courseData.tracks = [];
        form.reset();
    }

    onAddTrack(): void {
        const newTrack: GolfTrack = {
            id: -1,
            courseId: -1,
            name: "",
            abbreviation: ""
        };
        if (!this.courseData.tracks) {
            this.courseData.tracks = [];
        }
        this.courseData.tracks.push(newTrack);
    }

    onRemoveTrack(trackToRemove: GolfTrack): void {
        if (this.courseData.tracks) {
            const trackIndex = this.courseData.tracks?.findIndex((track) => {
                return track === trackToRemove;
            });
            if (trackIndex > -1) {
                this.courseData.tracks.splice(trackIndex, 1);
            }
        }
    }

    onAddTeeSet(track: GolfTrack): void {
        let trackData = this.courseData.tracks?.find((t) => {
            return t === track;
        });
        if (trackData) {
            const newTeeSet: GolfTeeSet = {
                id: -1,
                trackId: -1,
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
        this.courseData.tracks?.forEach((track) => {
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
