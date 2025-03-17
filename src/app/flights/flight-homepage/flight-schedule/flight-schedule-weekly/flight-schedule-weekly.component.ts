import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { TableModule } from 'primeng/table';

import { FlightInfo } from 'src/app/shared/flight.model';
import { MatchSummary } from 'src/app/shared/match.model';

@Component({
  selector: 'app-flight-schedule-weekly',
  templateUrl: './flight-schedule-weekly.component.html',
  styleUrl: './flight-schedule-weekly.component.css',
  imports: [CommonModule, CarouselModule, TableModule],
})
export class FlightScheduleWeeklyComponent implements OnInit {
  @Input() info: FlightInfo;
  @Input() matches: MatchSummary[];

  matchesPerWeek: Record<string, MatchSummary[]> = {};
  weeklyMatches: MatchWeekData[] = [];

  private currentDate = new Date(); // new Date("2022-04-28T00:00:00-04:00"); // <-- test value
  currentWeek = 1;

  ngOnInit(): void {
    this.currentWeek = this.determineCurrentWeek();

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

  isMatchPlayed(match: MatchSummary): boolean {
    return match.home_score > 0 && match.away_score > 0;
  }

  isWinnerHome(match: MatchSummary): boolean {
    if (!this.isMatchPlayed(match)) {
      return false;
    }
    return match.home_score >= match.away_score;
  }

  isWinnerAway(match: MatchSummary): boolean {
    if (!this.isMatchPlayed(match)) {
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

  private determineCurrentWeek(): number {
    if (this.currentDate < this.info.start_date) {
      return 1;
    } else {
      for (let week = this.info.weeks; week > 1; week--) {
        const weekStartDate = new Date(this.info.start_date);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        if (this.currentDate >= weekStartDate) {
          return week;
        }
      }
    }
    return 1; // fall-through case, shouldn't be reachable
  }
}

interface MatchWeekData {
  week: number;
  matches: MatchSummary[];
}
