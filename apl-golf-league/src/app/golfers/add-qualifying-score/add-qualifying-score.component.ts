import { QualifyingScore } from './../../shared/qualifying-score.model';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { Golfer } from "../../shared/golfer.model";
import { GolfersService } from "../golfers.service";

@Component({
  selector: 'app-add-qualifying-score',
  templateUrl: './add-qualifying-score.component.html',
  styleUrls: ['./add-qualifying-score.component.css']
})
export class AddQualifyingScoreComponent implements OnInit, OnDestroy {
  isLoading = true;

  typeOptions: string[] = [
    "Qualifying Round",
    "Official Handicap Index"
  ];

  typeControl = new FormControl('', Validators.required);

  handicapIndexDateControl = new FormControl('', Validators.required);
  handicapIndexControl = new FormControl('', Validators.required);
  commentControl = new FormControl('');

  golferControl = new FormControl('');

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  filteredGolferOptions: Observable<Golfer[]>;
  selectedGolfer: Golfer | null;

  constructor(private golfersService: GolfersService) { }

  ngOnInit(): void {
    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe(result => {
      this.golferOptions = result.sort((a: Golfer, b: Golfer) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.isLoading = false;
    });

    this.filteredGolferOptions = this.golferControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        let golferName: string;
        if (this.isGolfer(value)) {
          golferName = value.name;
        } else {
          golferName = value;
        }
        const golfer = this.getGolferByName(golferName);
        if (golfer) {
          this.selectedGolfer = golfer;
        } else {
          this.selectedGolfer = null;
        }
        return this._filter(golferName);
      }),
    );

    this.golfersService.getAllGolfers();
  }

  ngOnDestroy(): void {
    this.golfersSub.unsubscribe();
  }

  clearForm(): void {
    this.selectedGolfer = null;
    this.golferControl.setValue("");
    this.typeControl.setValue("");
    this.handicapIndexDateControl.setValue("");
    this.handicapIndexControl.setValue("");
    this.commentControl.setValue("");
  }

  submitForm(): void {
    if (this.typeControl.value == "Official Handicap Index") {
      this.submitOfficialHandicapIndex();
      return;
    } else if (this.typeControl.value == "Qualifying Round") {
      this.submitQualifyingScores();
      return;
    } else {
      console.error("Invalid qualifying score type: " + this.typeControl.value);
      return;
    }
  }

  private submitOfficialHandicapIndex(): void {
    if (!this.selectedGolfer || !this.handicapIndexDateControl.valid || !this.handicapIndexControl.valid || !this.commentControl.valid) {
      console.error("Invalid input for 'Official Handicap Index' type, cannot submit form!");
      return;
    }

    const qualifyingScore: QualifyingScore = {
      golfer_id: this.selectedGolfer.id,
      year: (new Date()).getFullYear(),
      date_updated: (new Date()),
      date_played: this.handicapIndexDateControl.value,
      type: "Official Handicap Index",
      score_differential: this.handicapIndexControl.value / 2.0,
      comment: this.commentControl.value
    };

    // Submit qualifying score data twice (need two score differentials for handicap index)
    this.golfersService.postQualifyingScore(qualifyingScore).subscribe(result => {
      this.golfersService.postQualifyingScore(qualifyingScore).subscribe(result => {
        console.log(`Submitted qualifying scores for ${this.selectedGolfer?.name} (id=${this.selectedGolfer?.id})`);
        this.clearForm();
        this.isLoading = true;
        this.golfersService.getAllGolfers();
      });
    });
  }

  private submitQualifyingScores(): void {
    console.error("Not implemented yet!");
  }

  private isGolfer(object: any): object is Golfer {
    return (<Golfer> object).name !== undefined;
  }

  private getGolferByName(name: string): Golfer | null {
    for (const golfer of this.golferOptions) {
      if (golfer.name.toLowerCase() === name.toLowerCase()) {
        return golfer;
      }
    }
    return null;
  }

  private _filter(value: string): Golfer[] {
    const filterValue = value.toLowerCase();
    return this.golferOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
