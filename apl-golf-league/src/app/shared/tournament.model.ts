import { DivisionData } from "./division.model";
import { TournamentTeamData } from "./team.model";

export interface TournamentData {
    id: number
    year: number
    name: string
    date: Date
    course_id: number
    course: string
    logo_url?: string
    secretary?: string
    secretary_email?: string
    signup_start_date: Date
    signup_stop_date: Date
    members_entry_fee: number
    non_members_entry_fee: number
    divisions: DivisionData[]
    teams: TournamentTeamData[]
    shotgun: boolean
    strokeplay: boolean
    bestball: boolean
    scramble: boolean
    ryder_cup: boolean
    individual: boolean
    chachacha: boolean
}

export interface TournamentInfo {
  id: number
  year: number
  name: string
  date: Date
  secretary?: string
  secretary_email?: string
  signup_start_date: Date
  signup_stop_date: Date
  members_entry_fee: number
  non_members_entry_fee: number
  course: string
  logo_url?: string
  shotgun: boolean
  strokeplay: boolean
  bestball: boolean
  scramble: boolean
  ryder_cup: boolean
  individual: boolean
  chachacha: boolean
}
