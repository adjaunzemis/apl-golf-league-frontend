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
