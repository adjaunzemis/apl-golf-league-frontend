import { Component } from "@angular/core";

@Component({
    selector: "app-create-course",
    templateUrl: "./create-course.component.html",
    styleUrls: ["./create-course.component.css"]
})
export class CreateCourseComponent {
    trackData : {trackId: number, teeSetIds: number[]}[] = [];

    submit(): void {
        this.clear();
    }

    clear(): void {
        this.trackData = [];
    }

    addTrack(): void {
        this.trackData = [...this.trackData, {
                trackId: this.trackData.length + 1,
                teeSetIds: []
            }
        ];
    }

    removeTrack(trackId: number): void {
        const trackIdIndex = this.trackData.findIndex((track) => {
            return track.trackId === trackId;
        });
        if (trackIdIndex > -1) {
            this.trackData.splice(trackIdIndex, 1);
        }
    }

    addTeeSet(trackId: number): void {
        for (let tIdx = 0; tIdx < this.trackData.length; tIdx += 1) {
            if (this.trackData[tIdx].trackId === trackId) {
                this.trackData[tIdx].teeSetIds = [...this.trackData[tIdx].teeSetIds, this.trackData[tIdx].teeSetIds.length + 1];
            }
        }
    }

    removeTeeSet(trackId: number, teeSetId: number): void {
        this.trackData.forEach((track) => {
            if (track.trackId === trackId) {
                const teeSetIdIndex = track.teeSetIds.indexOf(teeSetId);
                if (teeSetIdIndex > -1) {
                    track.teeSetIds.splice(teeSetIdIndex, 1);
                }
            }
        });
    }
}
