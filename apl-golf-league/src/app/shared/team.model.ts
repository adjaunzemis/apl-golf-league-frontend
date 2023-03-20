import { Golfer, TeamGolferData } from "./golfer.model"
import { MatchData } from "./match.model"
import { RoundData } from "./round.model"
import { DivisionData } from "./division.model"

export interface TeamInfo {
  id: number
  name: string
  year: number
  golfers: TeamGolferData[]
}

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

export interface TeamGolferCreate {
  golfer: Golfer
  role: string
  division: DivisionData
}

export interface TeamCreate {
  name: string
  golfers: TeamGolferCreate[]
}
