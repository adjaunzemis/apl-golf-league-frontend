import { DivisionData } from "./division.model";
import { TournamentTeamData } from "./team.model";

export interface TournamentData {
    id: number
    year: number
    name: string
    date: Date
    course: string
    logo_url?: string
    secretary?: string
    secretary_contact?: string
    signup_start_date: Date
    signup_stop_date: Date
    divisions: DivisionData[]
    teams: TournamentTeamData[]
}

export interface TournamentInfo {
  id: number
  year: number
  name: string
  date: Date
  signup_start_date: Date
  signup_stop_date: Date
  course: string
  logo_url?: string
}
