import { Tee } from "./tee.model";
import { Golfer } from "./golfer.model";
import { HoleResult, HoleResultData } from "./hole-result.model";

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
  date_played: Date;
  golfer_name: string;
  handicap_index: number;
  playing_handicap: number;
  course_name: string;
  tee_name: string;
  tee_rating: number;
  tee_slope: number;
  tee_par: number;
  gross_score: number;
  adjusted_gross_score: number;
  net_score: number;
  holes: HoleResultData[];
}
