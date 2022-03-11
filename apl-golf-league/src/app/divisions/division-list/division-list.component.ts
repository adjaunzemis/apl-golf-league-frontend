import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CoursesService } from "src/app/courses/courses.service";
import { Tee } from "../../shared/tee.model";

import { DivisionData } from "../../shared/division.model";

@Component({
  selector: 'app-division-list',
  templateUrl: './division-list.component.html',
  styleUrls: ['./division-list.component.css']
})
export class DivisionListComponent implements OnInit, OnDestroy {
  @Input() divisions: DivisionData[];

  private divisionSub: Subscription;

  selectedDivision: DivisionData;
  selectedPrimaryTee: Tee;
  selectedSecondaryTee: Tee;

  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.coursesService.getSelectedTeeUpdated().subscribe(tee => {
      for (let division of this.divisions) {
        if (division.primary_tee_id === tee.id) {
          this.selectedPrimaryTee = tee;
        } else if (division.secondary_tee_id === tee.id) {
          this.selectedSecondaryTee = tee;
        }
      }
    });
  }

  ngOnDestroy(): void {
      this.divisionSub.unsubscribe();
  }

  onSelectDivision(division: DivisionData): void {
    this.selectedDivision = division;
    this.coursesService.getTee(division.primary_tee_id);
    this.coursesService.getTee(division.secondary_tee_id);
  }

}
