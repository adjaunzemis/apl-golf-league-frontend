import { RoundData } from "./round.model";

export interface MatchData {
  match_id: number;
  home_team_id: number;
  away_team_id: number;
  flight_name: string;
  week: number;
  home_score: number;
  away_score: number;
  rounds: RoundData[];
}
