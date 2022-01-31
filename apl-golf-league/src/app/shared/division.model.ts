export interface DivisionData {
    division_id: number
    flight_id: number
    name: string
    gender: string
    home_tee_name?: number
    home_tee_rating?: number
    home_tee_slope?: number
}

export interface TournamentDivisionData {
    division_id: number
    flight_id: number
    name: string
    gender: string
    primary_tee_name: number
    primary_tee_rating: number
    primary_tee_slope: number
    secondary_tee_name: number
    secondary_tee_rating: number
    secondary_tee_slope: number
}
