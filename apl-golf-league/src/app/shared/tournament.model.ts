import { DivisionData } from "./division.model";
import { TournamentTeamData } from "./team.model";

export interface TournamentData {
    tournament_id: number
    year: number
    date: Date
    name: string
    logo_url?: string
    secretary?: string
    secretary_contact?: string
    course_name: string
    divisions: DivisionData[]
    teams: TournamentTeamData[]
}
