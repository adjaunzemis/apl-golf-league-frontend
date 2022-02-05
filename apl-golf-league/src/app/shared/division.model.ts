export interface DivisionData {
    division_id: number
    flight_id: number
    name: string
    gender: string
    track_name: string
    tee_name: string
    tee_par: number
    tee_rating: number
    tee_slope: number
}

export interface TournamentDivisionData {
    division_id: number
    flight_id: number
    name: string
    gender: string
    primary_track_name: string
    primary_tee_name: string
    primary_tee_par: number
    primary_tee_rating: number
    primary_tee_slope: number
    secondary_track_name: string
    secondary_tee_par: number
    secondary_tee_name: string
    secondary_tee_rating: number
    secondary_tee_slope: number
}
