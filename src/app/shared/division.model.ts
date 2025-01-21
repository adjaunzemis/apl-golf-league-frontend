export interface DivisionData {
    id: number
    flight_id?: number
    tournament_id?: number
    name: string
    gender: string
    primary_track_id: number
    primary_track_name: string
    primary_tee_id: number
    primary_tee_name: string
    primary_tee_par: number
    primary_tee_rating: number
    primary_tee_slope: number
    secondary_track_id: number
    secondary_track_name: string
    secondary_tee_par: number
    secondary_tee_id: number
    secondary_tee_name: string
    secondary_tee_rating: number
    secondary_tee_slope: number
}

export interface DivisionCreate {
  id?: number
  name: string
  gender: string
  primary_tee_id: number
  secondary_tee_id: number
}
