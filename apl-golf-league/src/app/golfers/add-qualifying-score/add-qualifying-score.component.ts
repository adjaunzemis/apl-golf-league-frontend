import { QualifyingScore } from './../../shared/qualifying-score.model';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, min, startWith } from "rxjs/operators";

import { Golfer } from "../../shared/golfer.model";
import { GolfersService } from "../golfers.service";

@Component({
  selector: 'app-add-qualifying-score',
  templateUrl: './add-qualifying-score.component.html',
  styleUrls: ['./add-qualifying-score.component.css']
})
export class AddQualifyingScoreComponent implements OnInit, OnDestroy {
  isLoading = true;

  golferControl = new FormControl('');

  typeOptions: string[] = [
    "Qualifying Round",
    "Official Handicap Index"
  ];

  typeControl = new FormControl('', Validators.required);

  handicapIndexDateControl = new FormControl('', Validators.required);
  handicapIndexControl = new FormControl('', Validators.required);
  commentControl = new FormControl('');

  round1Group = this.formBuilder.group({
    datePlayed: [''],
    courseName: [''],
    trackName: [''],
    teeName: [''],
    teeGender: [''],
    teeRating: [''],
    teeSlope: [''],
    comment: [''],
    pars: this.formBuilder.group({
      hole1: [''],
      hole2: [''],
      hole3: [''],
      hole4: [''],
      hole5: [''],
      hole6: [''],
      hole7: [''],
      hole8: [''],
      hole9: [''],
    }),
    scores: this.formBuilder.group({
      hole1: [''],
      hole2: [''],
      hole3: [''],
      hole4: [''],
      hole5: [''],
      hole6: [''],
      hole7: [''],
      hole8: [''],
      hole9: [''],
    })
  });

  round2Group = this.formBuilder.group({
    datePlayed: [''],
    courseName: [''],
    trackName: [''],
    teeName: [''],
    teeGender: [''],
    teeRating: [''],
    teeSlope: [''],
    comment: [''],
    pars: this.formBuilder.group({
      hole1: [''],
      hole2: [''],
      hole3: [''],
      hole4: [''],
      hole5: [''],
      hole6: [''],
      hole7: [''],
      hole8: [''],
      hole9: [''],
    }),
    scores: this.formBuilder.group({
      hole1: [''],
      hole2: [''],
      hole3: [''],
      hole4: [''],
      hole5: [''],
      hole6: [''],
      hole7: [''],
      hole8: [''],
      hole9: [''],
    })
  });

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  filteredGolferOptions: Observable<Golfer[]>;
  selectedGolfer: Golfer | null;

  constructor(private golfersService: GolfersService, private formBuilder: FormBuilder) { }

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
    this.round1Group.reset();
    this.round2Group.reset();
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

  computeRound1TotalPar(): number {
    return this.round1Group.get('pars')?.get('hole1')?.value as number
      + this.round1Group.get('pars')?.get('hole2')?.value as number
      + this.round1Group.get('pars')?.get('hole3')?.value as number
      + this.round1Group.get('pars')?.get('hole4')?.value as number
      + this.round1Group.get('pars')?.get('hole5')?.value as number
      + this.round1Group.get('pars')?.get('hole6')?.value as number
      + this.round1Group.get('pars')?.get('hole7')?.value as number
      + this.round1Group.get('pars')?.get('hole8')?.value as number
      + this.round1Group.get('pars')?.get('hole9')?.value as number;
  }

  computeRound2TotalPar(): number {
    return this.round2Group.get('pars')?.get('hole1')?.value as number
      + this.round2Group.get('pars')?.get('hole2')?.value as number
      + this.round2Group.get('pars')?.get('hole3')?.value as number
      + this.round2Group.get('pars')?.get('hole4')?.value as number
      + this.round2Group.get('pars')?.get('hole5')?.value as number
      + this.round2Group.get('pars')?.get('hole6')?.value as number
      + this.round2Group.get('pars')?.get('hole7')?.value as number
      + this.round2Group.get('pars')?.get('hole8')?.value as number
      + this.round2Group.get('pars')?.get('hole9')?.value as number;
  }

  computeRound1TotalGrossScore(): number {
    return this.round1Group.get('scores')?.get('hole1')?.value as number
      + this.round1Group.get('scores')?.get('hole2')?.value as number
      + this.round1Group.get('scores')?.get('hole3')?.value as number
      + this.round1Group.get('scores')?.get('hole4')?.value as number
      + this.round1Group.get('scores')?.get('hole5')?.value as number
      + this.round1Group.get('scores')?.get('hole6')?.value as number
      + this.round1Group.get('scores')?.get('hole7')?.value as number
      + this.round1Group.get('scores')?.get('hole8')?.value as number
      + this.round1Group.get('scores')?.get('hole9')?.value as number;
  }

  computeRound2TotalGrossScore(): number {
    return this.round2Group.get('scores')?.get('hole1')?.value as number
      + this.round2Group.get('scores')?.get('hole2')?.value as number
      + this.round2Group.get('scores')?.get('hole3')?.value as number
      + this.round2Group.get('scores')?.get('hole4')?.value as number
      + this.round2Group.get('scores')?.get('hole5')?.value as number
      + this.round2Group.get('scores')?.get('hole6')?.value as number
      + this.round2Group.get('scores')?.get('hole7')?.value as number
      + this.round2Group.get('scores')?.get('hole8')?.value as number
      + this.round2Group.get('scores')?.get('hole9')?.value as number;
  }

  computeRound1TotalAdjustedGrossScore(): number {
    let adjustedGrossScore = 0;
    for (const holeNum of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      adjustedGrossScore += Math.min(this.round1Group.get('scores')?.get('hole' + holeNum)?.value, this.round1Group.get('pars')?.get('hole' + holeNum)?.value + 5);
    }
    return adjustedGrossScore;
  }

  computeRound2TotalAdjustedGrossScore(): number {
    let adjustedGrossScore = 0;
    for (const holeNum of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      adjustedGrossScore += Math.min(this.round2Group.get('scores')?.get('hole' + holeNum)?.value, this.round2Group.get('pars')?.get('hole' + holeNum)?.value + 5);
    }
    return adjustedGrossScore;
  }

  computeRound1ScoreDifferential(): number {
    const rating = (this.round1Group.get('teeRating')?.value as number);
    const slope = (this.round1Group.get('teeSlope')?.value as number);
    const score = this.computeRound1TotalAdjustedGrossScore();
    return (113.0 / slope) * (score - rating);
  }

  computeRound2ScoreDifferential(): number {
    const rating = (this.round2Group.get('teeRating')?.value as number);
    const slope = (this.round2Group.get('teeSlope')?.value as number);
    const score = this.computeRound2TotalAdjustedGrossScore();
    return (113.0 / slope) * (score - rating);
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
        console.log(`[AddQualifyingScoreComponent] Submitted qualifying scores for ${this.selectedGolfer?.name} (id=${this.selectedGolfer?.id})`);
        this.clearForm();
        this.isLoading = true;
        this.golfersService.getAllGolfers();
      });
    });
  }

  private submitQualifyingScores(): void {
    if (!this.selectedGolfer || !this.round1Group.valid || !this.round2Group.valid) {
      console.error("Invalid input for 'Qualifying Round' type, cannot submit form!")
      return;
    }

    const qualifyingScoreRound1: QualifyingScore = {
      golfer_id: this.selectedGolfer.id,
      year: (new Date()).getFullYear(),
      date_updated: (new Date()),
      date_played: this.round1Group.get('datePlayed')?.value,
      type: "Qualifying Round",
      course_name: this.round1Group.get('courseName')?.value,
      track_name: this.round1Group.get('trackName')?.value,
      tee_name: this.round1Group.get('teeName')?.value,
      tee_gender: this.round1Group.get('teeGender')?.value,
      tee_rating: this.round1Group.get('teeRating')?.value,
      tee_slope: this.round1Group.get('teeSlope')?.value,
      tee_par: this.computeRound1TotalPar(),
      gross_score: this.computeRound1TotalGrossScore(),
      adjusted_gross_score: this.computeRound1TotalAdjustedGrossScore(),
      score_differential: this.computeRound1ScoreDifferential(),
      comment: this.round1Group.get('comment')?.value
    };

    const qualifyingScoreRound2: QualifyingScore = {
      golfer_id: this.selectedGolfer.id,
      year: (new Date()).getFullYear(),
      date_updated: (new Date()),
      date_played: this.round2Group.get('datePlayed')?.value,
      type: "Qualifying Round",
      course_name: this.round2Group.get('courseName')?.value,
      track_name: this.round2Group.get('trackName')?.value,
      tee_name: this.round2Group.get('teeName')?.value,
      tee_gender: this.round2Group.get('teeGender')?.value,
      tee_rating: this.round2Group.get('teeRating')?.value,
      tee_slope: this.round2Group.get('teeSlope')?.value,
      tee_par: this.computeRound2TotalPar(),
      gross_score: this.computeRound2TotalGrossScore(),
      adjusted_gross_score: this.computeRound2TotalAdjustedGrossScore(),
      score_differential: this.computeRound2ScoreDifferential(),
      comment: this.round2Group.get('comment')?.value
    };

    // Submit qualifying score data twice (need two score differentials for handicap index)
    this.golfersService.postQualifyingScore(qualifyingScoreRound1).subscribe(result => {
      this.golfersService.postQualifyingScore(qualifyingScoreRound2).subscribe(result => {
        console.log(`[AddQualifyingScoreComponent] Submitted qualifying scores for ${this.selectedGolfer?.name} (id=${this.selectedGolfer?.id})`);
        this.clearForm();
        this.isLoading = true;
        this.golfersService.getAllGolfers();
      });
    });
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
