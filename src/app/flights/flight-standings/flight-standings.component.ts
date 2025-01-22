import { FlightData } from 'src/app/shared/flight.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-standings',
  templateUrl: './flight-standings.component.html',
  styleUrls: ['./flight-standings.component.css'],
  standalone: false,
})
export class FlightStandingsComponent implements OnInit {
  @Input() flight: FlightData;

  standingsData: Record<number, TeamStandingsData> = {};
  orderedTeamIds: number[] = [];

  ngOnInit(): void {
    if (!this.flight) {
      console.error('Unable to process flight standings, no flight data!');
      return;
    }
    if (!this.flight.matches) {
      console.error('Unable to process flight standings, no match data!');
      return;
    }

    for (const match of this.flight.matches) {
      if (!this.standingsData[match.home_team_id]) {
        this.standingsData[match.home_team_id] = new TeamStandingsData();
        this.standingsData[match.home_team_id].teamName = match.home_team_name;
      }

      if (!this.standingsData[match.away_team_id]) {
        this.standingsData[match.away_team_id] = new TeamStandingsData();
        this.standingsData[match.away_team_id].teamName = match.away_team_name;
      }

      if (match.home_score || match.away_score) {
        this.standingsData[match.home_team_id].matchesPlayed += 1;
        this.standingsData[match.home_team_id].pointsWon += match.home_score;

        this.standingsData[match.away_team_id].matchesPlayed += 1;
        this.standingsData[match.away_team_id].pointsWon += match.away_score;
      }
    }

    for (const teamId in this.standingsData) {
      this.orderedTeamIds.push(parseInt(teamId));
    }

    this.orderedTeamIds.sort((teamId1: number, teamId2: number) => {
      const avgPtsWon1 = this.getAveragePointsWon(teamId1);
      const avgPtsWon2 = this.getAveragePointsWon(teamId2);
      if (avgPtsWon1 > avgPtsWon2) {
        return -1;
      } else if (avgPtsWon1 < avgPtsWon2) {
        return 1;
      }
      return this.getTiebreaker(teamId1, teamId2);
    });

    this.standingsData[this.orderedTeamIds[0]].position = '1';
    for (let idx = 1; idx < this.orderedTeamIds.length; idx++) {
      if (
        this.getAveragePointsWon(this.orderedTeamIds[idx]) <
        this.getAveragePointsWon(this.orderedTeamIds[idx - 1])
      ) {
        this.standingsData[this.orderedTeamIds[idx]].position = (idx + 1).toString();
      } else {
        this.standingsData[this.orderedTeamIds[idx]].position = '';
      }
    }
  }

  private getTiebreaker(teamId1: number, teamId2: number): number {
    if (!this.flight) {
      console.error('Unable to process tie-breakers, no flight data!');
      return 0;
    }
    if (!this.flight.matches) {
      console.error('Unable to process tie-breakers, no match data!');
      return 0;
    }

    // Tie-breaker 1: head-to-head score
    let pointsWonTeam1 = 0;
    let pointsWonTeam2 = 0;
    for (const match of this.flight.matches) {
      if (match.home_team_id === teamId1 && match.away_team_id === teamId2) {
        pointsWonTeam1 += match.home_score;
        pointsWonTeam2 += match.away_score;
      } else if (match.home_team_id === teamId2 && match.away_team_id === teamId1) {
        pointsWonTeam2 += match.home_score;
        pointsWonTeam1 += match.away_score;
      }
    }
    if (pointsWonTeam1 > pointsWonTeam2) {
      return -1;
    } else if (pointsWonTeam1 < pointsWonTeam2) {
      return 1;
    }
    return 0;

    // TODO: Implement further tie-breakers if needed.
  }

  getTeamPosition(id: number): string {
    if (!this.standingsData[id]) {
      return 'n/a';
    }
    return this.standingsData[id].position;
  }

  getTeamName(id: number): string {
    if (!this.standingsData[id]) {
      return 'n/a';
    }
    return this.standingsData[id].teamName;
  }

  getMatchesPlayed(id: number): number {
    if (!this.standingsData[id]) {
      return -1;
    }
    return this.standingsData[id].matchesPlayed;
  }

  getPointsWon(id: number): number {
    if (!this.standingsData[id]) {
      return -1;
    }
    return this.standingsData[id].pointsWon;
  }

  getAveragePointsWon(id: number): number {
    if (!this.standingsData[id]) {
      return -1;
    }
    if (this.standingsData[id].matchesPlayed === 0) {
      return 0;
    }
    return this.standingsData[id].pointsWon / this.standingsData[id].matchesPlayed;
  }
}

class TeamStandingsData {
  teamName: string;
  matchesPlayed = 0;
  pointsWon = 0;
  position = '';
}
