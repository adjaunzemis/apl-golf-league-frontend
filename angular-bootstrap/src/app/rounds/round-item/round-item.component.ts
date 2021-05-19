import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GolfRound } from '../../shared/golf-models';

@Component({
  selector: 'app-round-item',
  templateUrl: './round-item.component.html',
  styleUrls: ['./round-item.component.css']
})
export class RoundItemComponent implements OnInit {
  @Input() round: GolfRound;
  @Output() roundSelected = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onSelected(): void {
    this.roundSelected.emit();
  }

}
