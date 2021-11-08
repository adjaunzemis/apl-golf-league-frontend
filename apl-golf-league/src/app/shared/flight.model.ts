import { DivisionData } from "./division.model"
import { TeamData } from "./team.model"

export class FlightData {
    flight_id: number
    year: number
    name: string
    home_course_name?: string
    divisions?: DivisionData[]
    teams?: TeamData[]
}
