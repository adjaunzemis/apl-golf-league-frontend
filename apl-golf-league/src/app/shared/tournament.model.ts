export interface TournamentData {
    tournament_id: number
    year: number
    name: string
    logo_url?: string
    secretary: string
    secretary_contact: string
    course_name: string
    // divisions: List[TournamentDivisionData] = []
    // teams: List[TournamentTeamData] = []
}
