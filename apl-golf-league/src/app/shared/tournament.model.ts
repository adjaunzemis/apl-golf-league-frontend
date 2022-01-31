import { TournamentDivisionData } from "./division.model";
import { TournamentTeamData } from "./team.model";

export interface TournamentData {
    tournament_id: number
    year: number
    name: string
    logo_url?: string
    secretary: string
    secretary_contact: string
    course_name: string
    divisions: TournamentDivisionData[]
    teams: TournamentTeamData[]
}
