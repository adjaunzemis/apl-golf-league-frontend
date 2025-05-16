import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

import { GolferData } from 'src/app/shared/golfer.model';
import { Season } from 'src/app/shared/season.model';

@Component({
  selector: 'app-golfer-info',
  templateUrl: './golfer-info.component.html',
  styleUrl: './golfer-info.component.css',
  imports: [CommonModule, FormsModule, CardModule],
})
export class GolferInfoComponent {
  @Input() golfer: GolferData;
  @Input() season: Season;
}
