import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TournamentsService } from '../tournaments.service';
import { CoursesService } from '../../courses/courses.service';
import { TournamentTeamData } from '../../shared/team.model';
import { TeamGolferData } from '../../shared/golfer.model';
import { HoleResultInput, RoundInput, TournamentInput } from '../../shared/match.model';
import { RoundData } from '../../shared/round.model';
import { Course } from '../../shared/course.model';
import { Track } from '../../shared/track.model';
import { Tee } from '../../shared/tee.model';
import { HoleResultData } from '../../shared/hole-result.model';
import { TournamentData, TournamentInfo } from '../../shared/tournament.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';

@Component({
  selector: 'app-tournament-scorecard-create',
  templateUrl: './tournament-scorecard-create.component.html',
  styleUrls: ['./tournament-scorecard-create.component.css'],
  standalone: false,
})
export class TournamentScorecardCreateComponent implements OnInit, OnDestroy {
  isLoading = true;
  isSubmittingRounds = false;

  hideForPrint = false;

  handicapAllowance = 1.0;

  private currentYear: number;
  private seasonsSub: Subscription;

  showInstructions = false;

  private tournamentId: number;
  private tournamentInfoSub: Subscription;
  tournamentOptions: TournamentInfo[] = [];
  selectedTournamentInfo: TournamentInfo;

  tournamentSelector = new UntypedFormControl('');
  private tournamentDataSub: Subscription;
  selectedTournament: TournamentData;

  private courseDataSub: Subscription;
  tournamentCourse: Course;

  private currentDate = new Date(); // new Date("2022-04-28T00:00:00-04:00"); // <-- test value

  selectedTeam: TournamentTeamData | null;
  selectedTeamGolfers: TeamGolferData[] = [];

  roundsFront: RoundData[] = [];
  roundsBack: RoundData[] = [];

  roundIdx = 0;

  editMode = true;

  constructor(
    private tournamentsService: TournamentsService,
    private coursesService: CoursesService,
    private seasonsService: SeasonsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const paramsTournamentId = this.route.snapshot.queryParamMap.get('tournament_id');
    if (paramsTournamentId) {
      this.tournamentId = Number(paramsTournamentId);
    }

    this.tournamentInfoSub = this.tournamentsService.getListUpdateListener().subscribe((result) => {
      console.log(`[TournamentScorecardCreateComponent] Received current tournaments list`);
      this.tournamentOptions = result;
      this.isLoading = false;
      if (this.tournamentId) {
        for (const flightInfo of this.tournamentOptions) {
          if (flightInfo.id == this.tournamentId) {
            this.selectedTournamentInfo = flightInfo;
            this.loadTournamentData();
            break;
          }
        }
      }
    });

    this.tournamentDataSub = this.tournamentsService
      .getTournamentUpdateListener()
      .subscribe((result) => {
        console.log(
          `[TournamentScorecardCreateComponent] Received data for tournament: ${result.name} (${result.year})`,
        );
        this.selectedTournament = result;
        this.tournamentSelector.setValue(result.name);
        this.clearSelectedTeamData();
        this.isLoading = false;
        this.loadTournamentCourse();
      });

    this.courseDataSub = this.coursesService
      .getSelectedCourseUpdateListener()
      .subscribe((result) => {
        console.log(
          `[TournamentScorecardCreateComponent] Received data for course: ${result.name} (${result.year})`,
        );
        this.tournamentCourse = result;
        this.isLoading = false;
      });

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      this.currentYear = result.year;

      this.getTournamentOptions();
    });
  }

  ngOnDestroy(): void {
    this.tournamentInfoSub.unsubscribe();
    this.tournamentDataSub.unsubscribe();
    this.courseDataSub.unsubscribe();
    this.seasonsSub.unsubscribe();
  }

  private getTournamentOptions(): void {
    this.isLoading = true;
    this.tournamentsService.getList(this.currentYear);
  }

  private clearSelectedTeamData(): void {
    this.selectedTeam = null;
    this.selectedTeamGolfers = [];
    this.roundsFront = [];
    this.roundsBack = [];
  }

  onSelectedTournamentChanged(selection: MatSelectChange): void {
    this.clearSelectedTeamData();
    this.selectedTournamentInfo = selection.value as TournamentInfo;
    this.loadTournamentData();
  }

  private loadTournamentData(): void {
    console.log(
      `[TournamentScorecardCreateComponent] Selected tournament: ${this.selectedTournamentInfo.name} (${this.selectedTournamentInfo.year})`,
    );
    this.isLoading = true;
    this.tournamentsService.getTournament(this.selectedTournamentInfo.id);
  }

  private loadTournamentCourse(): void {
    console.log(
      `[TournamentScorecardCreateComponent] Loading course data for tournament: ${this.selectedTournamentInfo.name} (${this.selectedTournamentInfo.year})`,
    );
    this.isLoading = true;
    this.coursesService.getCourse(this.selectedTournament.course_id);
  }

  onSelectedTeamChanged(team: TournamentTeamData): void {
    this.clearSelectedTeamData();
    console.log(`[TournamentScorecardCreateComponent] Selected team: ${team.name}`);
    this.selectedTeam = team;

    // TODO: Implement round setup for other tournament types as-needed
    if (this.selectedTournament.scramble) {
      // Initialize team round for front track
      const trackFront = this.tournamentCourse.tracks[0]; // TODO: account for other ordering of tracks
      const teesFront = trackFront.tees[0]; // TODO: handle no-match case?
      this.roundsFront.push(
        this.createTeamScrambleRound(
          this.tournamentCourse,
          trackFront,
          teesFront,
          this.selectedTeam,
        ),
      );

      // Initialize team round for back track
      const trackBack = this.tournamentCourse.tracks[1]; // TODO: account for other ordering of tracks
      const teesback = trackBack.tees[0]; // TODO: handle no-match case?
      this.roundsBack.push(
        this.createTeamScrambleRound(this.tournamentCourse, trackBack, teesback, this.selectedTeam),
      );
    } else {
      for (const golfer of team.golfers) {
        const division = this.selectedTournament.divisions.filter(
          (d) => d.id == golfer.division_id,
        )[0]; // TODO: handle no-match case?

        // Initialize round played by golfer on front track
        const trackFront = this.tournamentCourse.tracks[0]; // TODO: account for other ordering of tracks
        const teesFront = trackFront.tees.filter((t) => t.id == division.primary_tee_id)[0]; // TODO: handle no-match case?
        this.roundsFront.push(
          this.createGolferRound(
            this.tournamentCourse,
            trackFront,
            teesFront,
            this.selectedTeam,
            golfer,
          ),
        );

        // Initialize round played by golfer on back track
        const trackBack = this.tournamentCourse.tracks[1]; // TODO: account for other ordering of tracks
        const teesBack = trackBack.tees.filter((t) => t.id == division.secondary_tee_id)[0]; // TODO: handle no-match case?
        this.roundsBack.push(
          this.createGolferRound(
            this.tournamentCourse,
            trackBack,
            teesBack,
            this.selectedTeam,
            golfer,
          ),
        );
      }
    }
  }

  async printScorecard() {
    this.hideForPrint = true;
    await new Promise((r) => setTimeout(r, 500)); // wait to register changes to UI
    window.print();
    await new Promise((r) => setTimeout(r, 500)); // wait to restore full UI
    this.hideForPrint = false;
  }

  getScorecardTitle(): string {
    return this.tournamentCourse.name;
  }

  getScorecardSubtitle(): string {
    return new Date(this.selectedTournament.date).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getTeamRoundFront(): RoundData {
    const teamFirstRound = this.roundsFront[0];
    const teamRound: RoundData = {
      round_id: -1, // TODO: remove placeholder?
      team_id: teamFirstRound.team_id,
      date_played: this.selectedTournament.date,
      round_type: 'Tournament',
      golfer_id: -1, // TODO: remove placeholder?
      golfer_name: teamFirstRound.team_name ? teamFirstRound.team_name : 'n/a',
      golfer_playing_handicap: undefined,
      team_name: teamFirstRound.team_name,
      course_id: this.selectedTournament.course_id,
      course_name: this.selectedTournament.course,
      track_id: teamFirstRound.track_id,
      track_name: teamFirstRound.track_name,
      tee_id: teamFirstRound.tee_id,
      tee_name: teamFirstRound.tee_name,
      tee_gender: teamFirstRound.tee_gender,
      tee_rating: teamFirstRound.tee_rating,
      tee_slope: teamFirstRound.tee_slope,
      tee_par:
        this.selectedTournament.bestball > 0
          ? this.selectedTournament.bestball * teamFirstRound.tee_par
          : teamFirstRound.tee_par,
      tee_color: teamFirstRound.tee_color,
      gross_score: 0, // TODO: remove placeholder?
      adjusted_gross_score: 0, // TODO: remove placeholder?
      net_score: 0, // TODO: remove placeholder?
      holes: this.createHoleResultDataForTeam(this.roundsFront, undefined),
    };
    return teamRound;
  }

  getTeamRoundBack(): RoundData {
    const teamFirstRound = this.roundsBack[0];
    const teamRound: RoundData = {
      round_id: -1, // TODO: remove placeholder?
      team_id: teamFirstRound.team_id,
      date_played: this.selectedTournament.date,
      round_type: 'Tournament',
      golfer_id: -1, // TODO: remove placeholder?
      golfer_name: teamFirstRound.team_name ? teamFirstRound.team_name : 'n/a',
      golfer_playing_handicap: undefined,
      team_name: teamFirstRound.team_name,
      course_id: this.selectedTournament.course_id,
      course_name: this.selectedTournament.course,
      track_id: teamFirstRound.track_id,
      track_name: teamFirstRound.track_name,
      tee_id: teamFirstRound.tee_id,
      tee_name: teamFirstRound.tee_name,
      tee_gender: teamFirstRound.tee_gender,
      tee_rating: teamFirstRound.tee_rating,
      tee_slope: teamFirstRound.tee_slope,
      tee_par:
        this.selectedTournament.bestball > 0
          ? this.selectedTournament.bestball * teamFirstRound.tee_par
          : teamFirstRound.tee_par,
      tee_color: teamFirstRound.tee_color,
      gross_score: 0, // TODO: remove placeholder?
      adjusted_gross_score: 0, // TODO: remove placeholder?
      net_score: 0, // TODO: remove placeholder?
      holes: this.createHoleResultDataForTeam(this.roundsBack, undefined),
    };
    return teamRound;
  }

  private createTeamScrambleRound(
    course: Course,
    track: Track,
    tee: Tee,
    team: TournamentTeamData,
  ): RoundData {
    const teamHandicap = undefined; // TODO: set default team handicap
    return {
      round_id: -1, // TODO: remove placeholder?
      team_id: team.id,
      date_played: this.selectedTournament.date,
      round_type: 'Tournament',
      golfer_id: -1, // TODO: remove placeholder?
      golfer_name: 'Scramble',
      golfer_playing_handicap: teamHandicap,
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
      holes: this.createPlaceholderHoleResultDataForRound(tee, teamHandicap),
    };
  }

  private createGolferRound(
    course: Course,
    track: Track,
    tee: Tee,
    team: TournamentTeamData,
    golfer: TeamGolferData,
  ): RoundData {
    const playingHandicap = this.computePlayingHandicap(golfer, tee);
    return {
      round_id: -1, // TODO: remove placeholder?
      team_id: team.id,
      date_played: this.selectedTournament.date,
      round_type: 'Tournament',
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
    let subtitle = '';
    if (this.selectedTournament.scramble) {
      subtitle += 'Gross';
    } else {
      subtitle += round.tee_name;
    }
    subtitle += ' | Hcp:';
    if (!this.editMode) {
      subtitle +=
        ' ' + (round.golfer_playing_handicap ? round.golfer_playing_handicap.toFixed(0) : '--');
    }
    return subtitle;
  }

  getTeamRoundTitle(): string {
    // TODO: Implement for other modes
    if (this.selectedTournament.scramble) {
      return 'Scramble';
    } else if (this.selectedTournament.bestball > 1) {
      return `${this.selectedTournament.bestball} Best Balls`;
    } else {
      return 'Best Ball';
    }
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
      const hole = rounds[0].holes[holeIdx];

      let holePar = hole.par;
      let grossScore = 99;
      let netScore = 99;
      if (this.selectedTournament.bestball === 2) {
        holePar = hole.par * 2;
        const grossScores = [99, 99];
        const netScores = [99, 99];
        for (const round of rounds) {
          const handicapStrokes = this.computeHandicapStrokes(
            hole.stroke_index,
            round.golfer_playing_handicap,
          );
          if (round.holes[holeIdx].gross_score < grossScores[1]) {
            if (round.holes[holeIdx].gross_score < grossScores[0]) {
              grossScores[1] = grossScores[0];
              grossScores[0] = round.holes[holeIdx].gross_score;
            } else {
              grossScores[1] = round.holes[holeIdx].gross_score;
            }
          }
          if (round.holes[holeIdx].gross_score - handicapStrokes < netScores[1]) {
            if (round.holes[holeIdx].gross_score - handicapStrokes < netScores[0]) {
              netScores[1] = netScores[0];
              netScores[0] = round.holes[holeIdx].gross_score - handicapStrokes;
            } else {
              netScores[1] = round.holes[holeIdx].gross_score - handicapStrokes;
            }
          }
        }
        grossScore = grossScores[0] + grossScores[1];
        netScore = netScores[0] + netScores[1];
      } else {
        grossScore = 99;
        netScore = 99;
        for (const round of rounds) {
          const handicapStrokes = this.computeHandicapStrokes(
            hole.stroke_index,
            round.golfer_playing_handicap,
          );
          grossScore = Math.min(grossScore, round.holes[holeIdx].gross_score);
          netScore = Math.min(netScore, round.holes[holeIdx].gross_score - handicapStrokes);
        }
      }

      holeResultData.push({
        hole_result_id: -1, // TODO: remove placeholder?
        round_id: -1, // TODO: remove placeholder?
        tee_id: hole.tee_id,
        hole_id: hole.hole_id,
        number: hole.number,
        par: holePar,
        yardage: hole.yardage,
        stroke_index: hole.stroke_index,
        handicap_strokes: this.computeHandicapStrokes(hole.stroke_index, playingHandicap),
        gross_score: grossScore,
        adjusted_gross_score: 0, // TODO: remove placeholder?
        net_score: netScore,
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

  postRounds(): void {
    if (
      this.isTournamentInputDataInvalid() ||
      !this.selectedTournament ||
      !this.selectedTeam ||
      !this.selectedTeamGolfers ||
      !this.roundsFront ||
      !this.roundsBack
    ) {
      // TODO: throw error
      console.error('Unable to post scores, incomplete or invalid data!');
      return;
    }

    // Compile round input data
    const rounds: RoundInput[] = [];

    // For scramble tournaments, duplicate team rounds for each golfer
    // TODO: Handle other non-individual tournament types as-needed
    if (this.selectedTournament.scramble) {
      for (const golfer of this.selectedTeam.golfers) {
        const division = this.selectedTournament.divisions.filter(
          (d) => d.id == golfer.division_id,
        )[0]; // TODO: handle no-match case?

        // Create round input from placeholder round for front track
        const trackFront = this.tournamentCourse.tracks[0]; // TODO: account for other ordering of tracks
        const teesFront = trackFront.tees.filter((t) => t.id == division.primary_tee_id)[0]; // TODO: handle no-match case?
        const roundFrontPlaceholder = this.createGolferRound(
          this.tournamentCourse,
          trackFront,
          teesFront,
          this.selectedTeam,
          golfer,
        );

        // Set hole scores from team round data
        const roundFront = this.roundsFront[0];
        const holesFront: HoleResultInput[] = [];
        for (const hole of roundFront.holes) {
          const holeResultInput: HoleResultInput = {
            hole_id: hole.hole_id,
            gross_score: hole.gross_score,
          };
          holesFront.push(holeResultInput);
        }
        const roundFrontInput: RoundInput = {
          team_id: this.selectedTeam.id,
          course_id: roundFront.course_id,
          track_id: roundFrontPlaceholder.track_id,
          tee_id: roundFrontPlaceholder.tee_id,
          golfer_id: golfer.golfer_id,
          golfer_playing_handicap: roundFront.golfer_playing_handicap,
          holes: holesFront,
        };
        rounds.push(roundFrontInput);

        // Create round input from placeholder round for back track
        const trackBack = this.tournamentCourse.tracks[1]; // TODO: account for other ordering of tracks
        const teesBack = trackBack.tees.filter((t) => t.id == division.secondary_tee_id)[0]; // TODO: handle no-match case?
        const roundBackPlaceholder = this.createGolferRound(
          this.tournamentCourse,
          trackBack,
          teesBack,
          this.selectedTeam,
          golfer,
        );

        // Set hole scores from team round data
        const roundBack = this.roundsBack[0];
        const holesBack: HoleResultInput[] = [];
        for (const hole of roundBack.holes) {
          const holeResultInput: HoleResultInput = {
            hole_id: hole.hole_id,
            gross_score: hole.gross_score,
          };
          holesBack.push(holeResultInput);
        }
        const roundBackInput: RoundInput = {
          team_id: this.selectedTeam.id,
          course_id: roundBack.course_id,
          track_id: roundBackPlaceholder.track_id,
          tee_id: roundBackPlaceholder.tee_id,
          golfer_id: golfer.golfer_id,
          golfer_playing_handicap: roundBack.golfer_playing_handicap,
          holes: holesBack,
        };
        rounds.push(roundBackInput);
      }
    } else {
      // individual strokeplay scoring
      for (const round of [...this.roundsFront, ...this.roundsBack]) {
        const holes: HoleResultInput[] = [];
        for (const hole of round.holes) {
          const holeResultInput: HoleResultInput = {
            hole_id: hole.hole_id,
            gross_score: hole.gross_score,
          };
          holes.push(holeResultInput);
        }
        const roundInput: RoundInput = {
          team_id: this.selectedTeam.id,
          course_id: round.course_id,
          track_id: round.track_id,
          tee_id: round.tee_id,
          golfer_id: round.golfer_id,
          golfer_playing_handicap: round.golfer_playing_handicap,
          holes: holes,
        };
        rounds.push(roundInput);
      }
    }

    // Submit tournament input data
    const tournamentInput: TournamentInput = {
      tournament_id: this.selectedTournament.id,
      date_played: this.selectedTournament.date,
      rounds: rounds,
    };
    this.isSubmittingRounds = true;
    this.tournamentsService.postRounds(tournamentInput).subscribe((result) => {
      console.log(`Submitted ${result.length} new tournament rounds`);
      console.log(result);
      this.isSubmittingRounds = false;
      // Reload form data after successful submission
      this.loadTournamentData();
    });
  }

  isTournamentInputDataInvalid(): boolean {
    // Check for valid gross score entries (positive-definite, not above 2*par+handicap)
    for (const round of this.roundsFront) {
      if (!round) {
        return true;
      }
      for (const hole of round.holes) {
        if (hole.gross_score < 1 || hole.gross_score > 2 * hole.par + hole.handicap_strokes) {
          return true;
        }
      }
    }

    for (const round of this.roundsBack) {
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
    return !this.selectedTournament || !this.selectedTeam;
  }
}
