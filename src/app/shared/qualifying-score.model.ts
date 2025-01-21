export interface QualifyingScore {
  golfer_id: number;
  year: number;
  type: string;
  score_differential: number;
  date_updated: Date;
  date_played?: Date;
  course_name?: string;
  track_name?: string;
  tee_name?: string;
  tee_gender?: string;
  tee_par?: number;
  tee_rating?: number;
  tee_slope?: number;
  gross_score?: number;
  adjusted_gross_score?: number;
  comment?: number;
}
