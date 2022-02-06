import { RoundSummary } from "./round.model";

export interface Golfer {
  id: number;
  name: string;
  affiliation: string;
}

export interface GolferData {
  golfer_id: number;
  name: string;
  affiliation: string;
  member_since?: number;
  team_golfer_data?: TeamGolferData[];
  handicap_index_data?: HandicapIndexData;
}

export interface TeamGolferData {
  team_id: number
  golfer_id: number
  golfer_name: string
  division_name: string
  flight_name: string
  team_name: string
  role: string
  statistics?: GolferStatistics
}

export interface GolferStatistics {
  num_rounds: number
  num_holes: number
  avg_gross_score: number
  avg_net_score: number
  num_aces: number
  num_albatrosses: number
  num_eagles: number
  num_birdies: number
  num_pars: number
  num_bogeys: number
  num_double_bogeys: number
  num_others: number
}

export interface HandicapIndexData {
  handicap_index: number
  date: Date
  scoring_record?: RoundSummary[]
}
