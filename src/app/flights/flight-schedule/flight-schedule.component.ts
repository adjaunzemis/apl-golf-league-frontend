import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';

import { FlightData } from '../../shared/flight.model';
import { MatchData, MatchSummary } from '../../shared/match.model';
import { MatchesService } from '../../matches/matches.service';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  styleUrls: ['./flight-schedule.component.css'],
  standalone: false,
})
export class FlightScheduleComponent implements OnInit, OnDestroy {
  @Input() flight: FlightData;
  isPlayoffFlight: boolean = false;

  private currentDate = new Date(); // new Date("2022-04-28T00:00:00-04:00"); // <-- test value
  selectedWeekOrRound: number = 1;
  weekOrRoundLabel: string = 'Week';
  weekOrRoundOptions: string[] = [];
  selectedWeekOrRoundMatches: MatchSummary[] = [];

  showScorecard: boolean = false;
  isLoadingSelectedMatchData: boolean = false;
  private matchDataSub: Subscription;
  selectedMatchData: MatchData | null;

  constructor(private matchesService: MatchesService) {}

  ngOnInit(): void {
    this.isPlayoffFlight = this.flight.name.includes('Playoffs');
    this.weekOrRoundLabel = this.isPlayoffFlight ? 'Round' : 'Week';

    this.matchDataSub = this.matchesService.getMatchUpdateListener().subscribe((result) => {
      console.log(`[FlightScheduleComponent] Received data for match: id=${result.match_id}`);
      this.selectedMatchData = result;
      this.isLoadingSelectedMatchData = false;
    });

    this.setWeekOrRoundOptions();
    this.selectedWeekOrRound = this.determineCurrentWeekOrRound();
    this.setSelectedWeekOrRoundMatches();
  }

  ngOnDestroy(): void {
    this.matchDataSub.unsubscribe();
  }

  onSelectedWeekOrRoundChanged(selectedWeekOrRoundChange: MatSelectChange): void {
    this.selectedWeekOrRound = parseInt((selectedWeekOrRoundChange.value as string).split(' ')[0]);
    this.setSelectedWeekOrRoundMatches();
  }

  onSelectMatch(matchSummary: MatchSummary): void {
    if (matchSummary.home_score && matchSummary.away_score) {
      if (this.selectedMatchData && this.selectedMatchData.match_id === matchSummary.match_id) {
        this.showScorecard = !this.showScorecard;
      } else {
        this.showScorecard = true;
        this.isLoadingSelectedMatchData = true;
        this.matchesService.getMatch(matchSummary.match_id);
      }
    }
  }

  private determineCurrentWeekOrRound(): number {
    if (this.currentDate < this.flight.start_date) {
      return 1;
    } else {
      for (let week = this.flight.weeks; week > 1; week--) {
        let weekStartDate = new Date(this.flight.start_date);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        if (this.currentDate >= weekStartDate) {
          return week;
        }
      }
    }
    return 1; // fall-through case, shouldn't be reachable
  }

  private setWeekOrRoundOptions(): void {
    for (let week = 1; week <= this.flight.weeks; week++) {
      if (!this.isPlayoffFlight) {
        let weekStartDate = new Date(this.flight.start_date);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);

        let nextWeekStartDate = new Date(weekStartDate);
        nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 6);

        this.weekOrRoundOptions.push(
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
      } else {
        let roundName: string;
        if (week === this.flight.weeks) {
          roundName = 'Finals';
        } else if (week === this.flight.weeks - 1) {
          roundName = 'Semi-Finals';
        } else if (week === this.flight.weeks - 2) {
          roundName = 'Quarter-Finals';
        } else {
          roundName = `Round of ${Math.pow(2, this.flight.weeks - week + 1)}`;
        }
        this.weekOrRoundOptions.push(week + ': ' + roundName);
      }
    }
  }

  private setSelectedWeekOrRoundMatches(): void {
    this.showScorecard = false;
    this.selectedMatchData = null;

    this.selectedWeekOrRoundMatches = [];
    if (this.flight.matches) {
      for (let match of this.flight.matches) {
        if (match.week === this.selectedWeekOrRound) {
          this.selectedWeekOrRoundMatches.push(match);
        }
      }
    }
  }
}
