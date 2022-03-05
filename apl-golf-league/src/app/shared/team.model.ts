import { Golfer, TeamGolferData } from "./golfer.model"
import { MatchData } from "./match.model"
import { RoundData } from "./round.model"

export interface TeamData {
    id: number
    flight_id: number
    name: string
    year: number
    golfers: TeamGolferData[]
    matches: MatchData[]
}

export interface TeamDataWithMatches {
    id: number
    name: string
    year: number
    golfers: TeamGolferData[]
    matches: MatchData[]
}

export interface TournamentTeamData {
    id: number
    name: string
    year: number
    tournament_id: number
    golfers: TeamGolferData[]
    rounds?: RoundData[]
}
