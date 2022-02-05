import { DivisionData } from "./division.model";
import { TournamentTeamData } from "./team.model";

export interface TournamentData {
    id: number
    year: number
    date: Date
    name: string
    course: string
    logo_url?: string
    secretary?: string
    secretary_contact?: string
    divisions: DivisionData[]
    teams: TournamentTeamData[]
}

export interface TournamentInfo {
  id: number
  year: number
  name: string
  date: Date
  course: string
  logo_url?: string
}
