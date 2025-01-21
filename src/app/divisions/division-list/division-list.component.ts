import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CoursesService } from "src/app/courses/courses.service";
import { Tee } from "../../shared/tee.model";

import { DivisionData } from "../../shared/division.model";

@Component({
    selector: 'app-division-list',
    templateUrl: './division-list.component.html',
    styleUrls: ['./division-list.component.css'],
    standalone: false
})
export class DivisionListComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadedPrimaryTee = false;
  private loadedSecondaryTee = false;

  @Input() divisions: DivisionData[];

  private divisionSub: Subscription;

  selectedDivision: DivisionData;
  selectedPrimaryTee: Tee;
  selectedSecondaryTee: Tee;

  showScorecard = false;

  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.divisionSub = this.coursesService.getSelectedTeeUpdated().subscribe(tee => {
      for (let division of this.divisions) {
        if (division.primary_tee_id === tee.id) {
          this.selectedPrimaryTee = tee;
          this.loadedPrimaryTee = true;
        } else if (division.secondary_tee_id === tee.id) {
          this.selectedSecondaryTee = tee;
          this.loadedSecondaryTee = true;
        }
      }
      if (this.loadedPrimaryTee && this.loadedSecondaryTee) {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.divisionSub.unsubscribe();
  }

  onSelectDivision(division: DivisionData): void {
    if (this.showScorecard && division === this.selectedDivision) {
      this.showScorecard = false;
      return;
    }

    this.showScorecard = true;
    this.selectedDivision = division;

    this.isLoading = true;
    this.loadedPrimaryTee = false;
    this.loadedSecondaryTee = false;
    this.coursesService.getTee(division.primary_tee_id);
    this.coursesService.getTee(division.secondary_tee_id);
  }

}
