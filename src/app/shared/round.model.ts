import { Tee } from './tee.model';
import { Golfer } from './golfer.model';
import { HoleResult, HoleResultData } from './hole-result.model';

export interface Round {
  id: number;
  tee: Tee;
  golfer: Golfer;
  handicap_index: number;
  date_played: Date;
  hole_results?: HoleResult[];
}

export interface RoundData {
  round_id: number;
  match_id?: number;
  team_id?: number;
  date_played: Date;
  round_type: string;
  golfer_id: number;
  golfer_name: string;
  golfer_playing_handicap?: number;
  team_name?: string;
  course_id: number;
  course_name: string;
  track_id: number;
  track_name: string;
  tee_id: number;
  tee_name: string;
  tee_gender: string;
  tee_rating: number;
  tee_slope: number;
  tee_par: number;
  tee_color: string;
  gross_score: number;
  adjusted_gross_score: number;
  net_score: number;
  holes: HoleResultData[];
}

export interface RoundSummary {
  date_played: Date;
  round_type: string;
  golfer_name: string;
  golfer_playing_handicap: number;
  course_name: string;
  track_name: string;
  tee_name: string;
  tee_gender: string;
  tee_par: number;
  tee_rating: number;
  tee_slope: number;
  gross_score: number;
  adjusted_gross_score: number;
  net_score: number;
  score_differential: number;
}
