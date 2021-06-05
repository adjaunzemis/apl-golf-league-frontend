import { Component } from "@angular/core";

import { GolfCourse } from "src/app/shared/golf-course.model";
import { GolfTrack } from 'src/app/shared/golf-track.model';
import { GolfTeeSet } from './../../shared/golf-tee-set.model';

@Component({
    selector: "app-create-course",
    templateUrl: "./create-course.component.html",
    styleUrls: ["./create-course.component.css"]
})
export class CreateCourseComponent {
    courseData: GolfCourse = {
        id: -1,
        name: "",
        abbreviation: ""
    }

    submit(): void {
        this.clear(); // TODO: connect to database to send course data
    }

    clear(): void {
        this.courseData.tracks = [];
    }

    addTrack(): void {
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

    removeTrack(trackToRemove: GolfTrack): void {
        if (this.courseData.tracks) {
            const trackIndex = this.courseData.tracks?.findIndex((track) => {
                return track === trackToRemove;
            });
            if (trackIndex > -1) {
                this.courseData.tracks.splice(trackIndex, 1);
            }
        }
    }

    addTeeSet(track: GolfTrack): void {
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

    removeTeeSet(teeSetToRemove: GolfTeeSet): void {
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
