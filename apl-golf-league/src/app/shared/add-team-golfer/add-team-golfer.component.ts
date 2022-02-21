import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Golfer } from '../golfer.model';

@Component({
  selector: 'app-add-team-golfer',
  templateUrl: './add-team-golfer.component.html',
  styleUrls: ['./add-team-golfer.component.css']
})
export class AddTeamGolferComponent implements OnInit {
  golferControl = new FormControl();
  @Input() golferOptions: Golfer[];
  filteredGolferOptions: Observable<Golfer[]>;

  roleControl = new FormControl();
  roleOptions: string[] = ['Captain', 'Player'];

  divisionControl = new FormControl();
  @Input() divisionOptions: string[] = ['Middle', 'Senior', 'Super-Senior', 'Forward'];

  constructor() { }

  ngOnInit() {
    this.filteredGolferOptions = this.golferControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (this.isGolfer(value)) {
          return this._filter(value.name);
        } else {
          return this._filter(value);
        }
      }),
    );
  }

  private isGolfer(object: any): object is Golfer {
    return (<Golfer> object).name !== undefined;
  }

  private _filter(value: string): Golfer[] {
    const filterValue = value.toLowerCase();
    return this.golferOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}

interface AddTeamGolferData {
  id: number
  name: string
  role: string
  division: string
}
