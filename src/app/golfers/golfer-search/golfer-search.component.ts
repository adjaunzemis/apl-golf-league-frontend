import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, UntypedFormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { GolfersService } from '../golfers.service';
import { Golfer } from '../../shared/golfer.model';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-golfer-search',
  templateUrl: './golfer-search.component.html',
  styleUrls: ['./golfer-search.component.css'],
  standalone: false,
})
export class GolferSearchComponent implements OnInit, OnDestroy {
  isLoading = true;

  golferControl = new UntypedFormControl('');

  private golfersSub: Subscription;
  golferOptions: Golfer[] = [];
  golferNameOptions: string[] = [];
  filteredGolferOptions: Observable<Golfer[]>;

  constructor(private golfersService: GolfersService) {}

  ngOnInit(): void {
    this.golfersSub = this.golfersService.getAllGolfersUpdateListener().subscribe((result) => {
      this.golferOptions = result.sort((a: Golfer, b: Golfer) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.golferNameOptions = result.map((golfer) => golfer.name);

      this.isLoading = false;
    });

    this.filteredGolferOptions = this.golferControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (this.isGolfer(value)) {
          return this._filter(value.name);
        } else {
          return this._filter(value);
        }
      }),
    );

    this.golfersService.getAllGolfers();
  }

  ngOnDestroy(): void {
    this.golfersSub.unsubscribe();
  }

  private isGolfer(object: unknown): object is Golfer {
    return (object as Golfer).name !== undefined;
  }

  private _filter(value: string): Golfer[] {
    const filterValue = value.toLowerCase();
    return this.golferOptions.filter((option) => option.name.toLowerCase().includes(filterValue));
  }
}
