import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-league-home',
  templateUrl: './league-home.component.html',
  styleUrls: ['./league-home.component.css']
})
export class LeagueHomeComponent implements OnInit {
  isLoading = false;

  // TODO: Replace placeholder flight info with database query
  flights: FlightInfo[] = [
    { id: 1, name: "Diamond Ridge", year: 2021, image: "courses/logo_DiamondRidge.PNG"},
    { id: 2, name: "Fairway Hills A", year: 2021, image: "courses/logo_FairwayHills.PNG"},
    { id: 3, name: "Fairway Hills B", year: 2021, image: "courses/logo_FairwayHills.PNG"},
    { id: 4, name: "Northwest Park", year: 2021,  image: "courses/logo_Northwest.PNG"},
    { id: 5, name: "Rattlewood", year: 2021,  image: "courses/logo_Rattlewood.PNG"},
    { id: 6, name: "Timbers at Troy", year: 2021,  image: "courses/logo_TimbersAtTroy.PNG"},
  ];

  // TODO: Replace placeholder tournament info with database query
  tournaments: TournamentInfo[] = [
    { id: 1, name: "Maryland National", year: 2021, image: "#", course: "Maryland National GC"},
    { id: 2, name: "Lake Presidential", year: 2021, image: "#", course: "Lake Presidential GC"},
    { id: 3, name: "Down in the Valley", year: 2021, image: "#", course: "Turf Valley GC"},
    { id: 4, name: "Grab Your Guns", year: 2021, image: "#", course: "Musket Ridge GC"},
    { id: 5, name: "Ryder Cup", year: 2021, image: "#", course: "South Hills GC"},
    { id: 6, name: "Banquet Tournament", year: 2021, image: "#", course: "Woodlands GC"}
  ];

  // TODO: Replace placeholder officer info with database query
  officers: OfficerInfo[] = [
    { name: "John Landshof", title: "President", email: "#" },
    { name: "Richie Steinwand", title: "Vice-President", email: "#" },
    { name: "Bob Erlandson", title: "Treasurer", email: "#" },
    { name: "Andris Jaunzemis", title: "Handicapper", email: "#" }
  ]

  ngOnInit(): void {
  }

}

interface FlightInfo {
  id: number
  name: string
  year: number
  image: string
}

interface TournamentInfo {
  id: number
  name: string
  year: number
  image: string
  course: string
}

interface OfficerInfo {
  name: string
  title: string
  email: string
}
