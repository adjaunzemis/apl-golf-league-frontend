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
  @Input() currentWeek: number;

  matchesPerWeek: Record<string, MatchSummary[]> = {};
  weeklyMatches: MatchWeekData[] = [];

  ngOnInit(): void {
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

  getPageForCurrentWeek(): number {
    if (this.currentWeek <= 2) {
      return 0;
    }
    if (this.currentWeek >= this.info.weeks - 1) {
      return this.info.weeks - 3;
    }
    return this.currentWeek - 2;
  }
}

interface MatchWeekData {
  week: number;
  matches: MatchSummary[];
}
