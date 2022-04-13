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
