import { Component, Input, OnInit } from "@angular/core";

import { DivisionData } from "../../shared/division.model";

@Component({
  selector: 'app-division-list',
  templateUrl: './division-list.component.html',
  styleUrls: ['./division-list.component.css']
})
export class DivisionListComponent implements OnInit {
  @Input() divisions: DivisionData[];

  constructor() { }

  ngOnInit(): void {

  }

}
