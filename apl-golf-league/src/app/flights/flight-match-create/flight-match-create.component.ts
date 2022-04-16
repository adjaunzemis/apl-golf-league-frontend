import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';

import { AppConfigService } from '../../app-config.service';
import { FlightsService } from '../flights.service';
import { CoursesService } from '../../courses/courses.service';
import { MatchesService } from '../../matches/matches.service';
import { GolfersService } from '../../golfers/golfers.service';
import { FlightData, FlightInfo } from '../../shared/flight.model';
import { TeamData } from '../../shared/team.model';
import { Course } from '../../shared/course.model';
import { Track } from '../../shared/track.model';

@Component({
  selector: 'app-flight-match-create',
  templateUrl: './flight-match-create.component.html',
  styleUrls: ['./flight-match-create.component.css']
})
export class FlightMatchCreateComponent implements OnInit, OnDestroy {
  isLoading = true;

  private currentYear: number;

  showInstructions: boolean = false;

  private flightInfoSub: Subscription;
  flightOptions: FlightInfo[] = [];

  private flightDataSub: Subscription;
  selectedFlight: FlightData;

  private courseInfoSub: Subscription;
  courseOptions: Course[] = [];

  private courseDataSub: Subscription;
  selectedCourse: Course;
  selectedTrack: Track;

  selectedTeam1: TeamData;
  selectedTeam2: TeamData;

  constructor(private appConfigService: AppConfigService, private flightsService: FlightsService, private coursesService: CoursesService, private matchesService: MatchesService, private golfersService: GolfersService) { }

  ngOnInit(): void {
    this.currentYear = this.appConfigService.currentYear;

    // Set up subscriptions
    this.courseInfoSub = this.coursesService.getCoursesUpdateListener().subscribe(result => {
      console.log(`[FlightMatchCreateComponent] Received courses list with ${result.courseCount} entries`);
      this.courseOptions = result.courses;
    });

    this.courseDataSub = this.coursesService.getSelectedCourseUpdateListener().subscribe(result => {
      console.log(`[FlightMatchCreateComponent] Received data for course: ${result.name} (${result.year})`);
      this.selectedCourse = result;
      this.isLoading = false;
    });

    this.flightInfoSub = this.flightsService.getFlightsListUpdateListener().subscribe(result => {
      console.log(`[FlightMatchCreateComponent] Received current flights list`);
      this.flightOptions = result.flights;
      this.isLoading = false;
    });

    this.flightDataSub = this.flightsService.getFlightUpdateListener().subscribe(result => {
      console.log(`[FlightMatchCreateComponent] Received data for flight: ${result.name} (${result.year})`);
      this.selectedFlight = result;
      this.isLoading = false;
    });

    // Gather initial data
    this.getCourseOptions();
    this.getFlightOptions();
  }

  ngOnDestroy(): void {
    this.flightInfoSub.unsubscribe();
    this.flightDataSub.unsubscribe();
    this.courseInfoSub.unsubscribe();
    this.courseDataSub.unsubscribe();
  }

  private getCourseOptions(): void {
    this.coursesService.getCourses();
  }

  onSelectedCourseChanged(selection: MatSelectChange): void {
    const courseInfo = selection.value as Course;
    console.log(`[FlightMatchCreateComponent] Selected course: ${courseInfo.name} (${courseInfo.year})`);
    this.isLoading = true;
    this.coursesService.getCourse(courseInfo.id);
  }

  onSelectedTrackChanged(selection: MatSelectChange): void {
    this.selectedTrack = selection.value as Track;
    console.log(`[FlightMatchCreateComponent] Selected track: ${this.selectedTrack.name} on course ${this.selectedCourse.name}`);
  }

  private getFlightOptions(): void {
    this.isLoading = true;
    this.flightsService.getFlightsList(this.currentYear);
  }

  onSelectedFlightChanged(selection: MatSelectChange): void {
    const flightInfo = selection.value as FlightInfo;
    console.log(`[FlightMatchCreateComponent] Selected flight: ${flightInfo.name} (${flightInfo.year})`);
    this.isLoading = true;
    this.flightsService.getFlight(flightInfo.id);
  }

  onSelectedTeamChanged(selection: MatSelectChange, teamNum: number): void {
    const selectedTeam = selection.value as TeamData;
    console.log(`[FlightMatchCreateComponent] Selected team 1: ${selectedTeam.name}`);
    if (teamNum === 1) {
      this.selectedTeam1 = selectedTeam;
    } else {
      this.selectedTeam2 = selectedTeam;
    }
  }

}
