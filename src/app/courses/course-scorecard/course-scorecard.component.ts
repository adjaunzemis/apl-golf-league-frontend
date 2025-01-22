import { Component, Input } from '@angular/core';

import { Tee } from 'src/app/shared/tee.model';

@Component({
  selector: 'app-course-scorecard',
  templateUrl: './course-scorecard.component.html',
  styleUrls: ['./course-scorecard.component.css'],
  standalone: false,
})
export class CourseScorecardComponent {
  @Input() tees: Tee[];
}
