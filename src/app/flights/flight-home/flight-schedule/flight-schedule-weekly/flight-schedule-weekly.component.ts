import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightInfo } from 'src/app/shared/flight.model';
import { MatchData, MatchSummary } from 'src/app/shared/match.model';
import { MatchesService } from 'src/app/matches/matches.service';
import { Subscription } from 'rxjs';
import { MatchScorecardComponent } from 'src/app/matches/match-scorecard/match-scorecard.component';

@Component({
  selector: 'app-flight-schedule-weekly',
  templateUrl: './flight-schedule-weekly.component.html',
  styleUrl: './flight-schedule-weekly.component.css',
  imports: [
    CommonModule,
    CarouselModule,
    TableModule,
    ProgressSpinnerModule,
    MatchScorecardComponent,
  ],
})
export class FlightScheduleWeeklyComponent implements OnInit, OnDestroy {
  @Input() info: FlightInfo;
  @Input() matches: MatchSummary[];
  @Input() currentWeek: number;
  @Input() numMatchesVisible = 3;

  matchesPerWeek: Record<string, MatchSummary[]> = {};
  weeklyMatches: MatchWeekData[] = [];

  selectedMatch: MatchSummary | undefined;
  selectedMatchData: MatchData | undefined;

  private matchesService = inject(MatchesService);
  private matchSub: Subscription;

  ngOnInit(): void {
    this.matchSub = this.matchesService.getMatchUpdateListener().subscribe((result) => {
      this.selectedMatchData = result;
    });

    for (let week = 1; week <= this.info.weeks; week++) {
      this.matchesPerWeek[week.toString()] = [];
    }

    for (const match of this.matches) {
      this.matchesPerWeek[match.week.toString()].push(match);
    }

    for (let week = 1; week <= this.info.weeks; week++) {
      this.weeklyMatches[week - 1] = {
        week: week,
        matches: this.matchesPerWeek[week.toString()],
      };
    }
  }

  ngOnDestroy(): void {
    this.matchSub.unsubscribe();
  }

  isWinnerHome(match: MatchSummary): boolean {
    if (match.home_score === null || match.away_score === null) {
      return false;
    }
    return match.home_score >= match.away_score;
  }

  isWinnerAway(match: MatchSummary): boolean {
    if (match.home_score === null || match.away_score === null) {
      return false;
    }
    return match.away_score >= match.home_score;
  }

  getWeekSpan(week: number): string {
    const d1 = new Date(this.info.start_date);
    d1.setDate(d1.getDate() + 7 * (week - 1));

    const d2 = new Date(d1);
    d2.setDate(d2.getDate() + 6);

    return (
      d1.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }) +
      ' - ' +
      d2.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
    );
  }

  getPageForCurrentWeek(): number {
    if (this.currentWeek <= this.numMatchesVisible - 1) {
      return 0;
    }
    if (this.currentWeek >= this.info.weeks - 1) {
      return this.info.weeks - this.numMatchesVisible;
    }
    return this.currentWeek - (this.numMatchesVisible - 1);
  }

  onMatchSelected(): void {
    if (!this.selectedMatch) {
      return; // no match to load
    }
    if (this.selectedMatchData && this.selectedMatch.match_id == this.selectedMatchData.match_id) {
      return; // this match is already loaded
    }
    this.selectedMatchData = undefined;
    this.matchesService.getMatch(this.selectedMatch.match_id);
  }

  getMatchTitle(match: MatchSummary, matchData?: MatchData): string {
    const homeTeam = match.home_team_name;
    const homeScore = match.home_score;
    const awayTeam = match.away_team_name;
    const awayScore = match.away_score;

    if (homeScore === null || awayScore === null) {
      return `${homeTeam} vs ${awayTeam} - To Be Played`;
    }

    let title: string;
    if (homeScore > awayScore) {
      title = `${homeTeam} (${homeScore}) def. ${awayTeam} (${awayScore})`;
    } else if (awayScore > homeScore) {
      title = `${awayTeam} (${awayScore}) def. ${homeTeam} (${homeScore})`;
    } else {
      title = `${homeTeam} (${homeScore}) tied ${awayTeam} (${awayScore})`;
    }

    if (matchData?.rounds.length == 0) {
      title += ' by forfeit';
    }

    return title;
  }

  isMatchPlayed(matchData?: MatchData): boolean {
    return matchData !== undefined && matchData.rounds.length > 0;
  }
}

interface MatchWeekData {
  week: number;
  matches: MatchSummary[];
}
