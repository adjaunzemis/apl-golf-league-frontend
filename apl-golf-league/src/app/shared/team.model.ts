import { Golfer, TeamGolferData } from "./golfer.model"
import { MatchData } from "./match.model"
import { RoundData } from "./round.model"

export interface TeamData {
    id: number
    flight_id: number
    name: string
    golfers: Golfer[]
    matches: MatchData[]
}

export interface TeamDataWithMatches {
    team_id: number
    name: string
    golfers: TeamGolferData[]
    matches: MatchData[]
}

export interface TournamentTeamData {
    id: number
    name: string
    tournament_id: number
    golfers: Golfer[]
    rounds?: RoundData[]
}
