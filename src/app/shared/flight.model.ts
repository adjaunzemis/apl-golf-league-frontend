import { DivisionData, DivisionCreate } from './division.model';
import { GolferStatistics } from './golfer.model';
import { MatchSummary } from './match.model';
import { TeamData } from './team.model';

export class FlightData {
  id: number;
  year: number;
  name: string;
  course_id: number;
  course: string;
  logo_url?: string;
  secretary?: string;
  secretary_email?: string;
  secretary_phone?: string;
  signup_start_date: Date;
  signup_stop_date: Date;
  start_date: Date;
  weeks: number;
  tee_times?: string;
  divisions: DivisionData[];
  teams?: TeamData[];
  matches?: MatchSummary[];
}

export interface FlightInfo {
  id: number;
  name: string;
  year: number;
  course?: string;
  address?: string;
  phone?: string;
  logo_url?: string;
  secretary: string;
  secretary_email?: string;
  secretary_phone?: string;
  signup_start_date: Date;
  signup_stop_date: Date;
  start_date: Date;
  weeks: number;
  tee_times?: string;
  num_teams: number;
}

export interface FlightCreate {
  id?: number;
  name: string;
  year: number;
  course_id: number;
  logo_url: string;
  secretary: string;
  secretary_email: string;
  secretary_phone: string;
  signup_start_date: Date;
  signup_stop_date: Date;
  start_date: Date;
  weeks: number;
  tee_times?: string;
  locked?: boolean;
  divisions: DivisionCreate[];
}

export interface FlightDivision {
  id: number;
  flight_id: number;
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

export interface FlightTeamGolfer {
  golfer_id: number;
  name: string;
  role: string;
  division: string;
}

export interface FlightTeam {
  flight_id: number;
  team_id: number;
  name: string;
  golfers: FlightTeamGolfer[];
}

export interface FlightStandingsTeam {
  team_id: number;
  team_name: string;
  points_won: number;
  matches_played: number;
  avg_points: number;
  position: string;
}

export interface FlightStandings {
  flight_id: number;
  teams: FlightStandingsTeam[];
}

export interface FlightGolferStatistics extends GolferStatistics {
  num_matches: number;
  points_won: number;
  avg_points_won: number;
}

export interface FlightStatistics {
  flight_id: number;
  golfers: FlightGolferStatistics[];
}
