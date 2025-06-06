import { DivisionCreate, DivisionData } from './division.model';
import { TeamGolferStatistics } from './golfer.model';
import { TournamentTeamData } from './team.model';

export interface TournamentData {
  id: number;
  year: number;
  name: string;
  date: Date;
  course_id: number;
  course: string;
  logo_url?: string;
  secretary?: string;
  secretary_email?: string;
  signup_start_date: Date;
  signup_stop_date: Date;
  members_entry_fee: number;
  non_members_entry_fee: number;
  divisions: DivisionData[];
  teams: TournamentTeamData[];
  shotgun: boolean;
  strokeplay: boolean;
  bestball: number;
  scramble: boolean;
  ryder_cup: boolean;
  individual: boolean;
  chachacha: boolean;
}

export interface TournamentInfo {
  id: number;
  year: number;
  name: string;
  date: Date;
  course: string;
  address?: string;
  phone?: string;
  logo_url?: string;
  secretary: string;
  secretary_email?: string;
  signup_start_date: Date;
  signup_stop_date: Date;
  members_entry_fee: number;
  non_members_entry_fee: number;
  shotgun: boolean;
  strokeplay: boolean;
  bestball: number;
  scramble: boolean;
  shamble: boolean;
  ryder_cup: boolean;
  individual: boolean;
  chachacha: boolean;
  num_teams: number;
}

export interface TournamentCreate {
  id?: number;
  name: string;
  year: number;
  course_id: number;
  logo_url: string;
  secretary: string;
  secretary_email: string;
  secretary_phone?: string;
  signup_start_date: Date;
  signup_stop_date: Date;
  date: Date;
  members_entry_fee: number;
  non_members_entry_fee: number;
  bestball: number;
  shotgun: boolean;
  strokeplay: boolean;
  scramble: boolean;
  individual: boolean;
  ryder_cup: boolean;
  chachacha: boolean;
  locked?: boolean;
  divisions: DivisionCreate[];
}

export interface TournamentDivision {
  id: number;
  tournament_id: number;
  name: string;
  gender: string;
  primary_track_id: number;
  primary_track_name: string;
  primary_tee_id: number;
  primary_tee_name: string;
  primary_tee_par: number;
  primary_tee_rating: number;
  primary_tee_slope: number;
  secondary_track_id: number;
  secondary_track_name: string;
  secondary_tee_par: number;
  secondary_tee_id: number;
  secondary_tee_name: string;
  secondary_tee_rating: number;
  secondary_tee_slope: number;
}

export interface TournamentTeamGolfer {
  golfer_id: number;
  name: string;
  role: string;
  division: string;
  handicap_index?: number;
  email?: string;
}

export type TournamentFreeAgentGolfer = TournamentTeamGolfer;

export interface TournamentTeam {
  tournament_id: number;
  team_id: number;
  name: string;
  golfers: TournamentTeamGolfer[];
}

export interface TournamentStandingsTeam {
  team_id: number;
  team_name: string;
  gross_score: number;
  net_score: number;
  position: string;
}

export interface TournamentStandingsGolfer {
  golfer_id: number;
  golfer_name: string;
  golfer_playing_handicap: number;
  gross_score: number;
  net_score: number;
  position: string;
}

export interface TournamentStandings {
  tournament_id: number;
  teams: TournamentStandingsTeam[];
  golfers: TournamentStandingsGolfer[];
}

export interface TournamentStatistics {
  tournament_id: number;
  golfers: TeamGolferStatistics[];
}
