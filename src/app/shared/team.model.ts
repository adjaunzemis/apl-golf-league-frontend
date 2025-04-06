import { TeamGolferData } from './golfer.model';
import { MatchData } from './match.model';
import { RoundData } from './round.model';

export interface TeamInfo {
  id?: number;
  name: string;
  golfers: TeamGolferData[];
}

export interface TeamData {
  id: number;
  flight_id: number;
  name: string;
  year: number;
  golfers: TeamGolferData[];
  matches: MatchData[];
}

export interface FlightTeamDataWithMatches {
  id: number;
  name: string;
  year: number;
  flight_id: number;
  golfers: TeamGolferData[];
  matches: MatchData[];
}

export interface TournamentTeamData {
  id: number;
  name: string;
  year: number;
  tournament_id: number;
  golfers: TeamGolferData[];
  rounds?: RoundData[];
}

export interface TeamGolferCreate {
  golfer_id: number;
  golfer_name: string;
  division_id: number;
  role: string;
}

export interface TeamCreate {
  id?: number;
  flight_id?: number;
  tournament_id?: number;
  name: string;
  golfers: TeamGolferCreate[];
}
