import { DivisionData, DivisionCreate } from './division.model';
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
