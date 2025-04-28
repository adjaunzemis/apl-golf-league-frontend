import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { GolferData } from 'src/app/shared/golfer.model';

@Component({
  selector: 'app-golfer-info',
  templateUrl: './golfer-info.component.html',
  styleUrl: './golfer-info.component.css',
  imports: [CommonModule, CardModule],
})
export class GolferInfoComponent {
  @Input() golfer: GolferData;
}
