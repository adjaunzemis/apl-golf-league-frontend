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

    addTeeSet(trackId: number): void {
        for (let tIdx = 0; tIdx < this.trackData.length; tIdx += 1) {
            if (this.trackData[tIdx].trackId === trackId) {
                this.trackData[tIdx].teeSetIds = [...this.trackData[tIdx].teeSetIds, this.trackData[tIdx].teeSetIds.length + 1];
            }
        }
    }
}
