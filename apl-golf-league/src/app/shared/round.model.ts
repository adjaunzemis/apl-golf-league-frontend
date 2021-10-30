import { Tee } from "./tee.model";
import { Golfer } from "./golfer.model";
import { HoleResult } from "./hole-result.model";

export interface Round {
  id: number;
  tee: Tee;
  golfer: Golfer;
  handicap_index: number;
  date_played: Date;
  hole_results?: HoleResult[];
}

export interface RoundSummary {
  round_id: number;
  date_played: Date;
  golfer_name: string;
  golfer_handicap_index: number;
  course_name: string;
  tee_name: string;
  tee_rating: number;
  tee_slope: number;
}
