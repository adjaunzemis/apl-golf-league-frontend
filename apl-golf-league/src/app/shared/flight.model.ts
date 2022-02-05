import { DivisionData } from "./division.model"
import { MatchSummary } from "./match.model"
import { TeamData } from "./team.model"

export class FlightData {
    flight_id: number
    year: number
    name: string
    logo_url?: string
    secretary?: string
    secretary_contact?: string
    course_name: string
    divisions?: DivisionData[]
    teams?: TeamData[]
    matches?: MatchSummary[]
}
