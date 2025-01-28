import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FlightsService } from '../flights.service';
import { CoursesService } from '../../courses/courses.service';
import { FlightData, FlightInfo } from '../../shared/flight.model';
import { TeamData } from '../../shared/team.model';
import { TeamGolferData } from '../../shared/golfer.model';
import {
  HoleResultInput,
  MatchData,
  MatchInput,
  MatchSummary,
  RoundInput,
} from '../../shared/match.model';
import { RoundData } from '../../shared/round.model';
import { Course } from '../../shared/course.model';
import { Track } from '../../shared/track.model';
import { Tee } from '../../shared/tee.model';
import { HoleResultData } from '../../shared/hole-result.model';
import { MatchesService } from '../../matches/matches.service';
import { SeasonsService } from 'src/app/seasons/seasons.service';

@Component({
  selector: 'app-flight-match-create',
  templateUrl: './flight-match-create.component.html',
  styleUrls: ['./flight-match-create.component.css'],
  standalone: false,
})
export class FlightMatchCreateComponent implements OnInit, OnDestroy {
  isLoading = true;
  isSubmittingRounds = false;

  hideForPrint = false;

  private currentYear: number;
  private seasonsSub: Subscription;

  showInstructions = false;

  selectedDate: Date = new Date();

  private flightId: number | null;
  private flightInfoSub: Subscription;
  flightOptions: FlightInfo[] = [];
  selectedFlightInfo: FlightInfo;

  flightSelector = new UntypedFormControl('');
  private flightDataSub: Subscription;
  selectedFlight: FlightData;

  private courseInfoSub: Subscription;
  courseOptions: Course[] = [];
  selectedCourseInfo: Course;

  private courseDataSub: Subscription;
  selectedCourse: Course;
  selectedTrack: Track;

  private currentDate = new Date(); // new Date("2022-04-28T00:00:00-04:00"); // <-- test value
  weekOptions: string[] = [];

  selectedWeek = 1;
  selectedWeekMatches: MatchSummary[];

  selectedMatch: MatchData | MatchSummary | null;

  selectedTeam1: TeamData | null;
  selectedTeam1Golfer1: TeamGolferData | null;
  selectedTeam1Golfer1Tee: Tee | null;
  team1Golfer1Round: RoundData | null;
  selectedTeam1Golfer2: TeamGolferData | null;
  selectedTeam1Golfer2Tee: Tee | null;
  team1Golfer2Round: RoundData | null;

  selectedTeam2: TeamData | null;
  selectedTeam2Golfer1: TeamGolferData | null;
  selectedTeam2Golfer1Tee: Tee | null;
  team2Golfer1Round: RoundData | null;
  selectedTeam2Golfer2: TeamGolferData | null;
  selectedTeam2Golfer2Tee: Tee | null;
  team2Golfer2Round: RoundData | null;

  roundIdx = 0;

  editMode = true;

  constructor(
    private flightsService: FlightsService,
    private coursesService: CoursesService,
    private matchesService: MatchesService,
    private seasonsService: SeasonsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const paramsFlightId = this.route.snapshot.queryParamMap.get('flight_id');
    if (paramsFlightId) {
      this.flightId = Number(paramsFlightId);
    }

    this.courseInfoSub = this.coursesService.getCoursesUpdateListener().subscribe((result) => {
      console.log(
        `[FlightMatchCreateComponent] Received courses list with ${result.courseCount} entries`,
      );
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

    this.courseDataSub = this.coursesService
      .getSelectedCourseUpdateListener()
      .subscribe((result) => {
        console.log(
          `[FlightMatchCreateComponent] Received data for course: ${result.name} (${result.year})`,
        );
        this.selectedCourse = result;
        this.isLoading = false;
        for (const track of result.tracks) {
          if (track.name.toLowerCase() === 'front') {
            this.selectedTrack = track;
            break;
          }
        }
      });

    this.flightInfoSub = this.flightsService.getFlightsListUpdateListener().subscribe((result) => {
      console.log(`[FlightMatchCreateComponent] Received current flights list`);
      this.flightOptions = result.flights;
      this.isLoading = false;
      if (this.flightId) {
        for (const flightInfo of this.flightOptions) {
          if (flightInfo.id == this.flightId) {
            this.selectedFlightInfo = flightInfo;
            this.loadFlightData();
            break;
          }
        }
      }
    });

    this.flightDataSub = this.flightsService.getFlightUpdateListener().subscribe((result) => {
      console.log(
        `[FlightMatchCreateComponent] Received data for flight: ${result.name} (${result.year})`,
      );
      this.selectedFlight = result;
      this.flightSelector.setValue(result.name);
      this.isLoading = false;

      if (result.course !== null && result.course !== undefined) {
        for (const courseInfo of this.courseOptions) {
          if (courseInfo.name.toLowerCase() === result.course.toLowerCase()) {
            this.selectedCourseInfo = courseInfo;
            this.loadCourseData();
            break;
          }
        }
      }

      this.setWeekOptions();
      this.selectedWeek = this.determineCurrentWeek();
      this.setSelectedWeekMatches();

      this.clearSelectedTeam(1);
      this.clearSelectedTeam(2);
    });

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.currentYear = result.year;

      this.getCourseOptions();
      this.getFlightOptions();
    });
  }

  ngOnDestroy(): void {
    this.flightInfoSub.unsubscribe();
    this.flightDataSub.unsubscribe();
    this.courseInfoSub.unsubscribe();
    this.courseDataSub.unsubscribe();
    this.seasonsSub.unsubscribe();
  }

  private getCourseOptions(): void {
    this.coursesService.getCourses();
  }

  onSelectedDateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value !== null) {
      console.log(`[FlightMatchCreateComponent] Selected date: ${event.value}`);
      this.selectedDate = event.value;
      for (const round of [
        this.team1Golfer1Round,
        this.team1Golfer2Round,
        this.team2Golfer1Round,
        this.team2Golfer2Round,
      ]) {
        if (round) {
          round.date_played = this.selectedDate;
        }
      }
    }
  }

  onSelectedCourseChanged(selection: MatSelectChange): void {
    this.clearMatchRounds();
    this.selectedCourseInfo = selection.value as Course;
    this.loadCourseData();
  }

  private loadCourseData(): void {
    console.log(
      `[FlightMatchCreateComponent] Selected course: ${this.selectedCourseInfo.name} (${this.selectedCourseInfo.year})`,
    );
    this.isLoading = true;
    this.coursesService.getCourse(this.selectedCourseInfo.id);
  }

  onSelectedTrackChanged(selection: MatSelectChange): void {
    this.clearMatchRounds();
    this.selectedTrack = selection.value as Track;
    console.log(
      `[FlightMatchCreateComponent] Selected track: ${this.selectedTrack.name} on course ${this.selectedCourse.name}`,
    );
    if (this.selectedTeam1Golfer1) {
      this.selectTeesForGolfer(this.selectedTeam1Golfer1, 1, 1);
    }
    if (this.selectedTeam1Golfer2) {
      this.selectTeesForGolfer(this.selectedTeam1Golfer2, 1, 2);
    }
    if (this.selectedTeam2Golfer1) {
      this.selectTeesForGolfer(this.selectedTeam2Golfer1, 2, 1);
    }
    if (this.selectedTeam2Golfer2) {
      this.selectTeesForGolfer(this.selectedTeam2Golfer2, 2, 2);
    }
  }

  private getFlightOptions(): void {
    this.isLoading = true;
    this.flightsService.getFlightsList(this.currentYear);
  }

  onSelectedFlightChanged(selection: MatSelectChange): void {
    this.clearMatchRounds();
    this.selectedFlightInfo = selection.value as FlightInfo;
    this.loadFlightData();
  }

  private loadFlightData(): void {
    console.log(
      `[FlightMatchCreateComponent] Selected flight: ${this.selectedFlightInfo.name} (${this.selectedFlightInfo.year})`,
    );
    this.isLoading = true;
    this.flightsService.getFlight(this.selectedFlightInfo.id);
  }

  onSelectedWeekChanged(selectedWeekChange: MatSelectChange): void {
    this.selectedWeek = parseInt((selectedWeekChange.value as string).split(' ')[0]);
    this.setSelectedWeekMatches();
  }

  private determineCurrentWeek(): number {
    if (this.currentDate < this.selectedFlight.start_date) {
      return 1;
    } else {
      for (let week = this.selectedFlight.weeks; week > 1; week--) {
        const weekStartDate = new Date(this.selectedFlight.start_date);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        if (this.currentDate >= weekStartDate) {
          return week;
        }
      }
    }
    return 1; // fall-through case, shouldn't be reachable
  }

  private setWeekOptions(): void {
    this.weekOptions = [];
    for (let week = 1; week <= this.selectedFlight.weeks; week++) {
      const weekStartDate = new Date(this.selectedFlight.start_date);
      weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);

      const nextWeekStartDate = new Date(weekStartDate);
      nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 6);

      this.weekOptions.push(
        week +
          ': ' +
          weekStartDate.toLocaleString('default', { month: 'short' }) +
          ' ' +
          weekStartDate.getDate() +
          ' - ' +
          nextWeekStartDate.toLocaleString('default', { month: 'short' }) +
          ' ' +
          nextWeekStartDate.getDate(),
      );
    }
  }

  private setSelectedWeekMatches(): void {
    this.selectedMatch = null;

    this.selectedWeekMatches = [];
    if (this.selectedFlight.matches) {
      for (const match of this.selectedFlight.matches) {
        if (match.week === this.selectedWeek) {
          this.selectedWeekMatches.push(match);
        }
      }
    }
  }

  onMatchSelected(match: MatchSummary) {
    this.clearSelectedTeam(1);
    this.clearSelectedTeam(2);
    this.selectedMatch = match;
    if (this.selectedFlight.teams) {
      for (const team of this.selectedFlight.teams) {
        if (team.id === match.home_team_id) {
          this.selectedTeam1 = team;
        } else if (team.id === match.away_team_id) {
          this.selectedTeam2 = team;
        }
      }
    }
  }

  onSelectedTeamChanged(selection: MatSelectChange, teamNum: number): void {
    this.selectedMatch = null;
    this.clearMatchRounds();
    const selectedTeam = selection.value as TeamData;
    console.log(`[FlightMatchCreateComponent] Selected team ${teamNum}: ${selectedTeam.name}`);
    if (teamNum === 1) {
      this.selectedTeam1 = selectedTeam;
    } else {
      this.selectedTeam2 = selectedTeam;
    }
  }

  onSelectedGolferChanged(selection: MatSelectChange, teamNum: number, golferNum: number): void {
    this.clearMatchRounds();
    const selectedGolfer = selection.value as TeamGolferData;
    console.log(
      `[FlightMatchCreateComponent] Selected team ${teamNum} golfer ${golferNum}: ${selectedGolfer.golfer_name}`,
    );
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
    this.selectTeesForGolfer(selectedGolfer, teamNum, golferNum);
  }

  private selectTeesForGolfer(golfer: TeamGolferData, teamNum: number, golferNum: number): void {
    const golferTee = this.getTeeForDivision(golfer.division_name);
    if (golferTee !== undefined) {
      console.log(
        `[FlightMatchCreateComponent] Selected tee for team ${teamNum} golfer ${golferNum}: ${golferTee.name}`,
      );
      if (golferNum === 1) {
        if (teamNum === 1) {
          this.selectedTeam1Golfer1Tee = golferTee;
        } else {
          this.selectedTeam2Golfer1Tee = golferTee;
        }
      } else {
        if (teamNum === 1) {
          this.selectedTeam1Golfer2Tee = golferTee;
        } else {
          this.selectedTeam2Golfer2Tee = golferTee;
        }
      }
    }
  }

  private getTeeForDivision(name: string): Tee | undefined {
    for (const division of this.selectedFlight.divisions) {
      if (division.name.toLowerCase() === name.toLowerCase()) {
        for (const tee of this.selectedTrack.tees) {
          if (tee.id === division.primary_tee_id || tee.id === division.secondary_tee_id) {
            return tee;
          }
        }
      }
    }
    return undefined;
  }

  onSelectedTeeChanged(selection: MatSelectChange, teamNum: number, golferNum: number): void {
    this.clearMatchRounds();
    const selectedTee = selection.value as Tee;
    console.log(
      `[FlightMatchCreateComponent] Selected tee for team ${teamNum} golfer ${golferNum}: ${selectedTee.name}`,
    );
    if (golferNum === 1) {
      if (teamNum === 1) {
        this.selectedTeam1Golfer1Tee = selectedTee;
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

  checkValidSelections(): boolean {
    if (
      this.selectedCourse &&
      this.selectedTrack &&
      this.selectedTeam1 &&
      this.selectedTeam1Golfer1 &&
      this.selectedTeam1Golfer1Tee &&
      this.selectedTeam1Golfer2 &&
      this.selectedTeam1Golfer2Tee &&
      this.selectedTeam2 &&
      this.selectedTeam2Golfer1 &&
      this.selectedTeam2Golfer1Tee &&
      this.selectedTeam2Golfer2 &&
      this.selectedTeam2Golfer2Tee
    ) {
      if (!this.editMode || this.selectedMatch) {
        return true;
      }
    }
    return false;
  }

  async printScorecard() {
    this.hideForPrint = true;
    await new Promise((r) => setTimeout(r, 500)); // wait to register changes to UI
    window.print();
    await new Promise((r) => setTimeout(r, 500)); // wait to restore full UI
    this.hideForPrint = false;
  }

  private clearMatchRounds(): void {
    this.team1Golfer1Round = null;
    this.team1Golfer2Round = null;
    this.team2Golfer1Round = null;
    this.team2Golfer2Round = null;
  }

  createMatchRounds(): void {
    if (
      this.selectedCourse &&
      this.selectedTrack &&
      this.selectedTeam1 &&
      this.selectedTeam1Golfer1 &&
      this.selectedTeam1Golfer1Tee &&
      this.selectedTeam1Golfer2 &&
      this.selectedTeam1Golfer2Tee &&
      this.selectedTeam2 &&
      this.selectedTeam2Golfer1 &&
      this.selectedTeam2Golfer1Tee &&
      this.selectedTeam2Golfer2 &&
      this.selectedTeam2Golfer2Tee
    ) {
      this.team1Golfer1Round = this.createRound(
        this.selectedCourse,
        this.selectedTrack,
        this.selectedTeam1Golfer1Tee,
        this.selectedTeam1,
        this.selectedTeam1Golfer1,
      );
      this.team2Golfer1Round = this.createRound(
        this.selectedCourse,
        this.selectedTrack,
        this.selectedTeam2Golfer1Tee,
        this.selectedTeam2,
        this.selectedTeam2Golfer1,
      );
      this.team1Golfer2Round = this.createRound(
        this.selectedCourse,
        this.selectedTrack,
        this.selectedTeam1Golfer2Tee,
        this.selectedTeam1,
        this.selectedTeam1Golfer2,
      );
      this.team2Golfer2Round = this.createRound(
        this.selectedCourse,
        this.selectedTrack,
        this.selectedTeam2Golfer2Tee,
        this.selectedTeam2,
        this.selectedTeam2Golfer2,
      );
    }
  }

  getMatchTitle(): string {
    return this.selectedCourse.name + ' - ' + this.selectedTrack.name;
  }

  getMatchSubtitle(): string {
    return new Date(this.selectedDate).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getRounds(): RoundData[] {
    return [...this.getRoundsForTeam(1), ...this.getRoundsForTeam(2)];
  }

  getRoundsForTeam(teamNum: number): RoundData[] {
    const rounds: RoundData[] = [];
    if (teamNum === 1) {
      for (const round of [this.team1Golfer1Round, this.team1Golfer2Round]) {
        if (round !== null && round !== undefined) {
          rounds.push(round);
        }
      }
    } else {
      for (const round of [this.team2Golfer1Round, this.team2Golfer2Round]) {
        if (round !== null && round !== undefined) {
          rounds.push(round);
        }
      }
    }
    return rounds;
  }

  getTeamRound(teamNum: number): RoundData {
    const teamGolferRounds: RoundData[] = [];
    const opponentGolferRounds: RoundData[] = [];
    if (teamNum === 1) {
      if (this.team1Golfer1Round) {
        teamGolferRounds.push(this.team1Golfer1Round);
      }
      if (this.team1Golfer2Round) {
        teamGolferRounds.push(this.team1Golfer2Round);
      }
      if (this.team2Golfer1Round) {
        opponentGolferRounds.push(this.team2Golfer1Round);
      }
      if (this.team2Golfer2Round) {
        opponentGolferRounds.push(this.team2Golfer2Round);
      }
    } else {
      if (this.team2Golfer1Round) {
        teamGolferRounds.push(this.team2Golfer1Round);
      }
      if (this.team2Golfer2Round) {
        teamGolferRounds.push(this.team2Golfer2Round);
      }
      if (this.team1Golfer1Round) {
        opponentGolferRounds.push(this.team1Golfer1Round);
      }
      if (this.team1Golfer2Round) {
        opponentGolferRounds.push(this.team1Golfer2Round);
      }
    }

    let teamHandicap = 0;
    for (const round of teamGolferRounds) {
      if (round.golfer_playing_handicap) {
        teamHandicap += round.golfer_playing_handicap;
      }
    }
    for (const round of opponentGolferRounds) {
      if (round.golfer_playing_handicap) {
        teamHandicap -= round.golfer_playing_handicap;
      }
    }

    const teamFirstRound = teamGolferRounds[0];
    const teamFirstRoundTee =
      teamNum === 1 ? this.selectedTeam1Golfer1Tee : this.selectedTeam2Golfer1Tee;

    const teamRound: RoundData = {
      round_id: -1, // TODO: remove placeholder?
      team_id: teamFirstRound.team_id,
      date_played: this.selectedDate,
      round_type: 'Flight',
      golfer_id: -1,
      golfer_name: teamFirstRound.team_name ? teamFirstRound.team_name : 'n/a',
      golfer_playing_handicap: teamHandicap > 0 ? teamHandicap : undefined,
      team_name: teamFirstRound.team_name,
      course_id: this.selectedCourse.id,
      course_name: this.selectedCourse.name,
      track_id: this.selectedTrack.id,
      track_name: this.selectedTrack.name,
      tee_id: teamFirstRoundTee ? teamFirstRoundTee.id : -1,
      tee_name: teamFirstRoundTee ? teamFirstRoundTee.name : 'n/a',
      tee_gender: teamFirstRoundTee ? teamFirstRoundTee.gender : 'n/a',
      tee_rating: teamFirstRoundTee ? teamFirstRoundTee.rating : -1,
      tee_slope: teamFirstRoundTee ? teamFirstRoundTee.slope : -1,
      tee_par: teamFirstRoundTee ? this.computeTeePar(teamFirstRoundTee) : -1,
      tee_color: teamFirstRoundTee ? teamFirstRoundTee.color : 'n/a',
      gross_score: 0, // TODO: remove placeholder?
      adjusted_gross_score: 0, // TODO: remove placeholder?
      net_score: 0, // TODO: remove placeholder?
      holes: this.createHoleResultDataForTeam(teamGolferRounds, Math.max(teamHandicap, 0)),
    };
    return teamRound;
  }

  private createRound(
    course: Course,
    track: Track,
    tee: Tee,
    team: TeamData,
    golfer: TeamGolferData,
  ): RoundData {
    const playingHandicap = this.computePlayingHandicap(golfer, tee);
    return {
      round_id: -1, // TODO: remove placeholder?
      team_id: team.id,
      date_played: this.selectedDate,
      round_type: 'Flight',
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
      holes: this.createPlaceholderHoleResultDataForRound(tee, playingHandicap),
    };
  }

  getRoundSubtitle(round: RoundData): string {
    return (
      round.tee_name +
      ' | Hcp: ' +
      (round.golfer_playing_handicap ? round.golfer_playing_handicap.toFixed(0) : '--')
    );
  }

  getTeamRoundSubtitle(teamNum: number): string {
    const teamRound = this.getTeamRound(teamNum);
    if (teamRound.golfer_playing_handicap === undefined || teamRound.golfer_playing_handicap <= 0) {
      return `Hcp Strokes: --`;
    }
    return `Hcp Strokes: ${teamRound.golfer_playing_handicap}`;
  }

  private computePlayingHandicap(golfer: TeamGolferData, tee: Tee): number | undefined {
    // Reference: USGA 2020 RoH 6.1
    // TODO: Query from server instead of computing in browser
    if (golfer.handicap_index === undefined) {
      return undefined;
    }
    return Math.round(
      golfer.handicap_index * (tee.slope / 113.0) + (tee.rating - this.computeTeePar(tee)),
    );
  }

  private computeTeePar(tee: Tee): number {
    let teePar = 0;
    for (const hole of tee.holes) {
      teePar += hole.par;
    }
    return teePar;
  }

  private createPlaceholderHoleResultDataForRound(
    tee: Tee,
    playingHandicap: number | undefined,
  ): HoleResultData[] {
    const holeResultData: HoleResultData[] = [];
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
        net_score: 0, // TODO: remove placeholder?
      });
    }
    return holeResultData;
  }

  private createHoleResultDataForTeam(
    rounds: RoundData[],
    playingHandicap: number | undefined,
  ): HoleResultData[] {
    const holeResultData: HoleResultData[] = [];
    for (let holeIdx = 0; holeIdx < rounds[0].holes.length; holeIdx++) {
      let grossScore = 0;
      for (const round of rounds) {
        grossScore += round.holes[holeIdx].gross_score;
      }

      const hole = rounds[0].holes[holeIdx];
      holeResultData.push({
        hole_result_id: -1, // TODO: remove placeholder?
        round_id: -1, // TODO: remove placeholder?
        tee_id: hole.tee_id,
        hole_id: hole.hole_id,
        number: hole.number,
        par: hole.par,
        yardage: hole.yardage,
        stroke_index: hole.stroke_index,
        handicap_strokes: this.computeHandicapStrokes(hole.stroke_index, playingHandicap),
        gross_score: grossScore,
        adjusted_gross_score: 0, // TODO: remove placeholder?
        net_score: 0, // TODO: remove placeholder?
      });
    }
    return holeResultData;
  }

  private computeHandicapStrokes(strokeIndex: number, playingHandicap: number | undefined): number {
    if (playingHandicap === undefined) {
      return 0;
    }
    if (playingHandicap < 0) {
      // plus-handicap
      return -playingHandicap * 2 > 18 - strokeIndex ? -1 : 0;
    }
    return (
      Math.floor((playingHandicap * 2) / 18) + ((playingHandicap * 2) % 18 >= strokeIndex ? 1 : 0)
    );
  }

  postMatchRounds(): void {
    if (
      this.isMatchDataInvalid() ||
      !this.selectedFlight ||
      !this.selectedMatch ||
      !this.selectedCourse ||
      !this.selectedTrack ||
      !this.selectedWeek ||
      !this.selectedDate ||
      !this.selectedTeam1 ||
      !this.selectedTeam1Golfer1 ||
      !this.selectedTeam1Golfer1Tee ||
      !this.team1Golfer1Round ||
      !this.selectedTeam1Golfer2 ||
      !this.selectedTeam1Golfer2Tee ||
      !this.team1Golfer2Round ||
      !this.selectedTeam2 ||
      !this.selectedTeam2Golfer1 ||
      !this.selectedTeam2Golfer1Tee ||
      !this.team2Golfer1Round ||
      !this.selectedTeam2Golfer2 ||
      !this.selectedTeam2Golfer2Tee ||
      !this.team2Golfer2Round
    ) {
      // TODO: throw error
      console.error('Unable to post scores, incomplete or invalid data!');
      return;
    }
    const rounds: RoundInput[] = [];
    for (const round of [this.team1Golfer1Round, this.team1Golfer2Round]) {
      const holes: HoleResultInput[] = [];
      for (const hole of round.holes) {
        const holeResultInput: HoleResultInput = {
          hole_id: hole.hole_id,
          gross_score: hole.gross_score,
        };
        holes.push(holeResultInput);
      }
      const roundInput: RoundInput = {
        team_id: this.selectedTeam1.id,
        course_id: this.selectedCourse.id,
        track_id: this.selectedTrack.id,
        tee_id: round.tee_id,
        golfer_id: round.golfer_id,
        golfer_playing_handicap: round.golfer_playing_handicap,
        holes: holes,
      };
      rounds.push(roundInput);
    }
    for (const round of [this.team2Golfer1Round, this.team2Golfer2Round]) {
      const holes: HoleResultInput[] = [];
      for (const hole of round.holes) {
        const holeResultInput: HoleResultInput = {
          hole_id: hole.hole_id,
          gross_score: hole.gross_score,
        };
        holes.push(holeResultInput);
      }
      const roundInput: RoundInput = {
        team_id: this.selectedTeam2.id,
        course_id: this.selectedCourse.id,
        track_id: this.selectedTrack.id,
        tee_id: round.tee_id,
        golfer_id: round.golfer_id,
        golfer_playing_handicap: round.golfer_playing_handicap,
        holes: holes,
      };
      rounds.push(roundInput);
    }
    const matchInput: MatchInput = {
      match_id: this.selectedMatch.match_id,
      flight_id: this.selectedFlight.id,
      week: this.selectedWeek,
      date_played: this.selectedDate,
      home_score: this.computeTeam1Score(), // TODO: Compute in backend
      away_score: this.computeTeam2Score(), // TODO: Compute in backend
      rounds: rounds,
    };
    this.isSubmittingRounds = true;
    this.matchesService.postMatchRounds(matchInput).subscribe(() => {
      this.isSubmittingRounds = false;
      // Reload form data after successful submission
      this.loadFlightData();
    });
  }

  computeTeam1Score(): number {
    let score = 0;
    const team1Round = this.getTeamRound(1);
    const team2Round = this.getTeamRound(2);

    for (let holeIdx = 0; holeIdx < 9; holeIdx++) {
      const team1HoleScore =
        team1Round.holes[holeIdx].gross_score - team1Round.holes[holeIdx].handicap_strokes;
      const team2HoleScore =
        team2Round.holes[holeIdx].gross_score - team2Round.holes[holeIdx].handicap_strokes;
      if (team1HoleScore < team2HoleScore) {
        score += 1;
      } else if (team1HoleScore == team2HoleScore) {
        score += 0.5;
      }
    }

    const netScoreDiff = this.getNetScoreDifference(team1Round, team2Round);
    if (netScoreDiff < 0) {
      score += 2;
    } else if (netScoreDiff == 0) {
      score += 1;
    }

    return score;
  }

  computeTeam2Score(): number {
    let score = 0;
    const team1Round = this.getTeamRound(1);
    const team2Round = this.getTeamRound(2);

    for (let holeIdx = 0; holeIdx < 9; holeIdx++) {
      const team1HoleScore =
        team1Round.holes[holeIdx].gross_score - team1Round.holes[holeIdx].handicap_strokes;
      const team2HoleScore =
        team2Round.holes[holeIdx].gross_score - team2Round.holes[holeIdx].handicap_strokes;
      if (team1HoleScore > team2HoleScore) {
        score += 1;
      } else if (team1HoleScore == team2HoleScore) {
        score += 0.5;
      }
    }

    const netScoreDiff = this.getNetScoreDifference(team1Round, team2Round);
    if (netScoreDiff > 0) {
      score += 2;
    } else if (netScoreDiff == 0) {
      score += 1;
    }

    return score;
  }

  isMatchDataInvalid(): boolean {
    // Check for valid gross score entries (positive-definite, not above 2*par+handicap)
    for (const round of [
      this.team1Golfer1Round,
      this.team1Golfer2Round,
      this.team2Golfer1Round,
      this.team2Golfer2Round,
    ]) {
      if (!round) {
        return true;
      }
      for (const hole of round.holes) {
        if (hole.gross_score < 1 || hole.gross_score > 2 * hole.par + hole.handicap_strokes) {
          return true;
        }
      }
    }

    // Check other entries for validity
    return (
      !this.selectedFlight ||
      !this.selectedMatch ||
      !this.selectedCourse ||
      !this.selectedTrack ||
      !this.selectedWeek ||
      !this.selectedDate ||
      !this.selectedTeam1 ||
      !this.selectedTeam1Golfer1 ||
      !this.selectedTeam1Golfer1Tee ||
      !this.team1Golfer1Round ||
      !this.selectedTeam1Golfer2 ||
      !this.selectedTeam1Golfer2Tee ||
      !this.team1Golfer2Round ||
      !this.selectedTeam2 ||
      !this.selectedTeam2Golfer1 ||
      !this.selectedTeam2Golfer1Tee ||
      !this.team2Golfer1Round ||
      !this.selectedTeam2Golfer2 ||
      !this.selectedTeam2Golfer2Tee ||
      !this.team2Golfer2Round
    );
  }

  private getNetScoreDifference(team1Round: RoundData, team2Round: RoundData): number {
    const team1NetScore = team1Round.holes
      .map((hole) => hole.gross_score - hole.handicap_strokes)
      .reduce((prev, next) => prev + next);
    const team2NetScore = team2Round.holes
      .map((hole) => hole.gross_score - hole.handicap_strokes)
      .reduce((prev, next) => prev + next);
    return team1NetScore - team2NetScore;
  }

  private clearSelectedTeam(teamNum: number) {
    this.clearSelectedGolfer(teamNum, 1);
    this.clearSelectedGolfer(teamNum, 2);
    if (teamNum === 1) {
      this.selectedTeam1 = null;
    } else {
      this.selectedTeam2 = null;
    }
  }

  private clearSelectedGolfer(teamNum: number, golferNum: number) {
    this.clearSelectedGolferTees(teamNum, golferNum);
    if (teamNum === 1) {
      if (golferNum === 1) {
        this.selectedTeam1Golfer1 = null;
      } else {
        this.selectedTeam1Golfer2 = null;
      }
    } else {
      if (golferNum === 1) {
        this.selectedTeam2Golfer1 = null;
      } else {
        this.selectedTeam2Golfer2 = null;
      }
    }
  }

  private clearSelectedGolferTees(teamNum: number, golferNum: number) {
    this.clearMatchRounds();
    if (teamNum === 1) {
      if (golferNum === 1) {
        this.selectedTeam1Golfer1Tee = null;
      } else {
        this.selectedTeam1Golfer2Tee = null;
      }
    } else {
      if (golferNum === 1) {
        this.selectedTeam2Golfer1Tee = null;
      } else {
        this.selectedTeam2Golfer2Tee = null;
      }
    }
  }
}
