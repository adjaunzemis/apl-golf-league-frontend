import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flights-home',
  templateUrl: './flights-home.component.html',
  styleUrls: ['./flights-home.component.css']
})
export class FlightsHomeComponent implements OnInit {
  isLoading = false;

  ngOnInit(): void {
  }

}
