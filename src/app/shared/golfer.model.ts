import { RoundSummary } from './round.model';

export enum GolferAffiliation {
  APL_EMPLOYEE = 'APL Employee',
  APL_RETIREE = 'APL Retiree',
  APL_FAMILY = 'APL Family',
  NON_APL_EMPLOYEE = 'Non-APL Employee',
}

export enum FreeAgentCadence {
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Biweekly',
  MONTHLY = 'Monthly',
  OCCASIONALLY = 'Occasionally',
}

export interface Golfer {
  id: number;
  name: string;
  affiliation: string;
  email?: string;
  phone?: string;
  handicap_index?: number;
  handicap_index_updated?: number;
}

export interface GolferData {
  golfer_id: number;
  name: string;
  affiliation: string;
  email?: string;
  phone?: string;
  member_since?: number;
  team_golfer_data?: TeamGolferData[];
  handicap_index_data?: HandicapIndexData;
  handicap_index?: number;
  handicap_index_updated?: string;
}

export interface TeamGolferData {
  team_id: number;
  golfer_id: number;
  golfer_name: string;
  golfer_email?: string;
  division_id?: number;
  division_name: string;
  flight_id?: number;
  flight_name?: string;
  tournament_id?: number;
  tournament_name?: string;
  team_name: string;
  year: number;
  role: string;
  statistics?: GolferStatisticsOLD;
  handicap_index?: number;
  handicap_index_updated?: number;
}

export interface GolferStatisticsOLD {
  num_rounds: number;
  num_holes: number;
  avg_gross_score: number;
  avg_net_score: number;
  num_aces: number;
  num_albatrosses: number;
  num_eagles: number;
  num_birdies: number;
  num_pars: number;
  num_bogeys: number;
  num_double_bogeys: number;
  num_others: number;
}

export interface HandicapIndexData {
  active_date: Date;
  active_handicap_index?: number;
  active_rounds?: RoundSummary[];
  pending_handicap_index?: number;
  pending_rounds?: RoundSummary[];
}

export interface GolferStatisticsScoring {
  avg_score: number;
  avg_score_to_par: number;
  avg_par_3_score: number;
  avg_par_4_score: number;
  avg_par_5_score: number;
  num_aces: number;
  num_albatrosses: number;
  num_eagles: number;
  num_birdies: number;
  num_pars: number;
  num_bogeys: number;
  num_double_bogeys: number;
  num_others: number;
}

export interface GolferStatistics {
  golfer_id: number;
  golfer_name: string;
  golfer_team_id: number;
  golfer_team_role: string;
  num_rounds: number;
  num_holes: number;
  num_par_3_holes: number;
  num_par_4_holes: number;
  num_par_5_holes: number;
  gross_scoring: GolferStatisticsScoring;
  net_scoring: GolferStatisticsScoring;
}
