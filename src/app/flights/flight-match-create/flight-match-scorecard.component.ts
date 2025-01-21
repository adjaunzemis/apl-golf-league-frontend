import { Component } from '@angular/core';

import { FlightMatchCreateComponent } from './flight-match-create.component';

@Component({
    selector: 'app-flight-match-scorecard',
    templateUrl: './flight-match-create.component.html',
    styleUrls: ['./flight-match-create.component.css'],
    standalone: false
})
export class FlightMatchScorecardComponent extends FlightMatchCreateComponent {
  editMode: boolean = false;
}
