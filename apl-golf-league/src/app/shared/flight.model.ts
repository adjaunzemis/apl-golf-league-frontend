import { DivisionData } from "./division.model"
import { MatchSummary } from "./match.model"
import { TeamData } from "./team.model"

export class FlightData {
    id: number
    year: number
    name: string
    course: string
    logo_url?: string
    secretary?: string
    secretary_contact?: string
    divisions?: DivisionData[]
    teams?: TeamData[]
    matches?: MatchSummary[]
}

export interface FlightInfo {
  id: number
  name: string
  year: number
  course: string
  logo_url?: string
}
