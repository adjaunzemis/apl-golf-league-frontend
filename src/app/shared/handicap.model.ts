export interface ScoringRecordRound {
  golfer_id: number;
  golfer_name: string;
  round_id: number | null;
  date_played: Date;
  round_type: string;
  scoring_type: string;
  course_name: string | null;
  track_name: string | null;
  tee_name: string | null;
  tee_par: number | null;
  tee_rating: number | null;
  tee_slope: number | null;
  playing_handicap: number | null;
  gross_score: number | null;
  adjusted_gross_score: number | null;
  net_score: number | null;
  score_differential: number;
  handicap_index: number | null;
}
