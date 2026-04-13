import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

export interface RoundEntryData {
  date_played: Date;
  course_name: string;
  track_name: string;
  tee_name: string;
  tee_gender: string;
  tee_rating: number;
  tee_slope: number;
  comment: string;
  holes: { par: number; score: number }[];
  total_par: number;
  total_score: number;
  total_adjusted_score: number;
  score_differential: number | null;
}

@Component({
  selector: 'app-qualifying-round-entry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
  ],
  templateUrl: './qualifying-round-entry.component.html',
  styleUrl: './qualifying-round-entry.component.css',
})
export class QualifyingRoundEntryComponent implements OnInit {
  @Input() instanceId = 'round-1';

  @Output() statusChange = new EventEmitter<{
    isValid: boolean;
    data: RoundEntryData | null;
  }>();

  private fb = inject(FormBuilder);
  roundForm: FormGroup;

  genderOptions = [
    { label: "Men's", value: 'MENS' },
    { label: "Ladies'", value: 'LADIES' },
  ];

  constructor() {
    this.roundForm = this.fb.group({
      date_played: [new Date(), Validators.required],
      course_name: ['', Validators.required],
      track_name: ['', Validators.required],
      tee_name: ['', Validators.required],
      tee_gender: [null, Validators.required],
      tee_rating: [null, [Validators.required, Validators.min(0)]],
      tee_slope: [null, [Validators.required, Validators.min(55), Validators.max(155)]],
      comment: [''],
      holes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const holesArray = this.roundForm.get('holes') as FormArray;
    for (let i = 0; i < 9; i++) {
      holesArray.push(
        this.fb.group({
          par: [null, [Validators.required, Validators.min(3), Validators.max(5)]],
          score: [null, [Validators.required, Validators.min(1)]],
        }),
      );
    }

    this.roundForm.statusChanges.subscribe(() => {
      this.emitStatus();
    });
  }

  get holesControls() {
    return (this.roundForm.get('holes') as FormArray).controls as FormGroup[];
  }

  get totalPar(): number {
    const holes = this.roundForm.get('holes')?.value as { par: number }[];
    return holes.reduce((sum, h) => sum + (h.par || 0), 0);
  }

  get totalScore(): number {
    const holes = this.roundForm.get('holes')?.value as { score: number }[];
    return holes.reduce((sum, h) => sum + (h.score || 0), 0);
  }

  get holeAdjustedScores(): number[] {
    const holes = this.roundForm.get('holes')?.value as { par: number; score: number }[];
    return holes.map((h) => {
      if (!h.par || !h.score) return 0;
      return Math.min(h.score, h.par + 5);
    });
  }

  get totalAdjustedScore(): number {
    return this.holeAdjustedScores.reduce((sum, s) => sum + s, 0);
  }

  get scoreDifferential(): number | null {
    const rating = this.roundForm.get('tee_rating')?.value;
    const slope = this.roundForm.get('tee_slope')?.value;
    const adjScore = this.totalAdjustedScore;

    if (!rating || !slope || !adjScore || this.roundForm.get('holes')?.invalid) {
      return null;
    }

    return (113 / slope) * (adjScore - rating);
  }

  get isTotalAdjusted(): boolean {
    return this.totalAdjustedScore < this.totalScore;
  }

  formatScore(score: number, par: number): string {
    if (!score) return '0';
    if (!par) return score.toString();
    const diff = score - par;
    const diffStr = diff === 0 ? 'E' : (diff > 0 ? `+${diff}` : `${diff}`);
    return `${score} (${diffStr})`;
  }

  isAdjusted(index: number): boolean {
    const holeValue = this.holesControls[index].value;
    if (!holeValue.par || !holeValue.score) return false;
    return holeValue.score > holeValue.par + 5;
  }

  private emitStatus(): void {
    if (this.roundForm.valid) {
      const formValue = this.roundForm.value;
      const data: RoundEntryData = {
        ...formValue,
        total_par: this.totalPar,
        total_score: this.totalScore,
        total_adjusted_score: this.totalAdjustedScore,
        score_differential: this.scoreDifferential,
      };
      this.statusChange.emit({ isValid: true, data });
    } else {
      this.statusChange.emit({ isValid: false, data: null });
    }
  }
}
