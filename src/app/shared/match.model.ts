import { RoundData } from './round.model';

export interface MatchSummary {
  match_id: number;
  home_team_id: number;
  home_team_name: string;
  away_team_id: number;
  away_team_name: string;
  flight_name: string;
  week: number;
  home_score: number | null;
  away_score: number | null;
}

export interface MatchData {
  match_id: number;
  home_team_id: number;
  home_team_name: string;
  away_team_id: number;
  away_team_name: string;
  flight_name: string;
  week: number;
  home_score: number;
  away_score: number;
  rounds: RoundData[];
}

export interface MatchInput {
  match_id: number;
  flight_id: number;
  week: number;
  date_played: Date;
  home_score: number;
  away_score: number;
  rounds: RoundInput[];
}

// TODO: Move to Tournament model?
export interface TournamentInput {
  tournament_id: number;
  date_played: Date;
  rounds: RoundInput[];
}

// TODO: Move to Round model?
export interface RoundInput {
  team_id: number;
  golfer_id: number;
  golfer_playing_handicap?: number;
  course_id: number;
  track_id: number;
  tee_id: number;
  holes: HoleResultInput[];
}

// TODO: Move to HoleResult model?
export interface HoleResultInput {
  hole_id: number;
  gross_score: number;
}
