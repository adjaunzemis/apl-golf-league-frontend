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
import { TeamGolferData } from '../../shared/golfer.model';
import { RoundData } from '../../shared/round.model';
import { Course } from '../../shared/course.model';
import { Track } from '../../shared/track.model';
import { Tee } from '../../shared/tee.model';
import { Hole } from '../../shared/hole.model';
import { HoleResultData } from '../../shared/hole-result.model';

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
  selectedTeam1Golfer1: TeamGolferData;
  selectedTeam1Golfer1Tee: Tee;
  team1Golfer1Round: RoundData;
  selectedTeam1Golfer2: TeamGolferData;
  selectedTeam1Golfer2Tee: Tee;
  team1Golfer2Round: RoundData;

  selectedTeam2: TeamData;
  selectedTeam2Golfer1: TeamGolferData;
  selectedTeam2Golfer1Tee: Tee;
  team2Golfer1Round: RoundData;
  selectedTeam2Golfer2: TeamGolferData;
  selectedTeam2Golfer2Tee: Tee;
  team2Golfer2Round: RoundData;

  constructor(private appConfigService: AppConfigService, private flightsService: FlightsService, private coursesService: CoursesService, private matchesService: MatchesService, private golfersService: GolfersService) { }

  ngOnInit(): void {
    this.currentYear = this.appConfigService.currentYear;

    // Set up subscriptions
    this.courseInfoSub = this.coursesService.getCoursesUpdateListener().subscribe(result => {
      console.log(`[FlightMatchCreateComponent] Received courses list with ${result.courseCount} entries`);
      this.courseOptions = result.courses.sort((a: Course, b: Course) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
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
    console.log(`[FlightMatchCreateComponent] Selected team ${teamNum}: ${selectedTeam.name}`);
    if (teamNum === 1) {
      this.selectedTeam1 = selectedTeam;
    } else {
      this.selectedTeam2 = selectedTeam;
    }
  }

  onSelectedGolferChanged(selection: MatSelectChange, teamNum: number, golferNum: number): void {
    const selectedGolfer = selection.value as TeamGolferData;
    console.log(`[FlightMatchCreateComponent] Selected team ${teamNum} golfer ${golferNum}: ${selectedGolfer.golfer_name}`);
    if (golferNum === 1) {
      if (teamNum === 1) {
        this.selectedTeam1Golfer1 = selectedGolfer;
      } else {
        this.selectedTeam2Golfer1 = selectedGolfer;
      }
    } else {
      if (teamNum === 1) {
        this.selectedTeam1Golfer2 = selectedGolfer;
      } else {
        this.selectedTeam2Golfer2 = selectedGolfer;
      }
    }
  }

  onSelectedTeeChanged(selection: MatSelectChange, teamNum: number, golferNum: number): void {
    const selectedTee = selection.value as Tee;
    console.log(`[FlightMatchCreateComponent] Selected tee for team ${teamNum} golfer ${golferNum}: ${selectedTee.name}`);
    if (golferNum === 1) {
      if (teamNum === 1) {
        this.selectedTeam1Golfer1Tee = selectedTee;
        this.team1Golfer1Round = this.createRound(this.selectedCourse, this.selectedTrack, selectedTee, this.selectedTeam1, this.selectedTeam1Golfer1);
      } else {
        this.selectedTeam2Golfer1Tee = selectedTee;
      }
    } else {
      if (teamNum === 1) {
        this.selectedTeam1Golfer2Tee = selectedTee;
      } else {
        this.selectedTeam2Golfer2Tee = selectedTee;
      }
    }
  }

  private createRound(course: Course, track: Track, tee: Tee, team: TeamData, golfer: TeamGolferData): RoundData {
    const playingHandicap = this.computePlayingHandicap(golfer, tee);
    return {
      round_id: -1, // TODO: remove placeholder?
      team_id: team.id,
      date_played: new Date(), // TODO: use date-picker
      round_type: "Flight",
      golfer_id: golfer.golfer_id,
      golfer_name: golfer.golfer_name,
      golfer_playing_handicap: playingHandicap,
      team_name: team.name,
      course_id: course.id,
      course_name: course.name,
      track_id: track.id,
      track_name: track.name,
      tee_id: tee.id,
      tee_name: tee.name,
      tee_gender: tee.gender,
      tee_rating: tee.rating,
      tee_slope: tee.slope,
      tee_par: this.computeTeePar(tee),
      tee_color: tee.color,
      gross_score: 0, // TODO: remove placeholder?
      adjusted_gross_score: 0, // TODO: remove placeholder?
      net_score: 0, // TODO: remove placeholder?
      holes: this.createHoleResultDataForRound(tee, playingHandicap)
    };
  }

  getRoundSubtitle(round: RoundData): string {
    return round.tee_name + " - PH: " + (round.golfer_playing_handicap ? round.golfer_playing_handicap.toFixed(0) : '--');
  }

  private computePlayingHandicap(golfer: TeamGolferData, tee: Tee): number {
    return 12; // TODO: query from server?
  }

  private computeTeePar(tee: Tee): number {
    let teePar = 0;
    for (const hole of tee.holes) {
      teePar += hole.par;
    }
    return teePar;
  }

  private createHoleResultDataForRound(tee: Tee, playingHandicap: number): HoleResultData[] {
    let holeResultData: HoleResultData[] = [];
    for (const hole of tee.holes) {
      holeResultData.push({
        hole_result_id: -1, // TODO: remove placeholder?
        round_id: -1, // TODO: remove placeholder?
        tee_id: tee.id,
        hole_id: hole.id,
        number: hole.number,
        par: hole.par,
        yardage: hole.yardage,
        stroke_index: hole.stroke_index,
        handicap_strokes: this.computeHandicapStrokes(hole.stroke_index, playingHandicap),
        gross_score: 0, // TODO: remove placeholder?
        adjusted_gross_score: 0, // TODO: remove placeholder?
        net_score: 0 // TODO: remove placeholder?
      });
    }
    return holeResultData;
  }

  private computeHandicapStrokes(strokeIndex: number, playingHandicap: number): number {
    if (playingHandicap < 0) { // plus-handicap
      return -(-playingHandicap * 2) > (18 - strokeIndex) ? 1 : 0;
    }
    return Math.floor((playingHandicap * 2) / 18) + ((playingHandicap * 2) % 18 >= strokeIndex ? 1 : 0);
  }

}
