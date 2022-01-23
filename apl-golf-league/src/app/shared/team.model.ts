import { Golfer, TeamGolferData } from "./golfer.model"
import { MatchData } from "./match.model"

export interface TeamData {
    id: number
    flight_id: number
    name: string
    golfers: Golfer[]
    matches: MatchData[]
}

export interface TeamDataWithMatches {
    team_id: number
    flight_id: number
    name: string
    golfers: TeamGolferData[]
    matches: MatchData[]
}
