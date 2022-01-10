import { PlayerData } from "./player.model";

export interface Golfer {
  id: number;
  name: string;
  affiliation: string;
}

export interface GolferData {
  golfer_id: number;
  name: string;
  affiliation: string;
  player_data?: PlayerData[];
}

export interface GolferStatistics {
  num_rounds: number;
  num_holes: number;
  avg_gross_score: number;
  avg_net_score: number;
  num_eagles: number;
  num_birdies: number;
  num_pars: number;
  num_bogeys: number;
  num_double_bogeys: number;
  num_others: number;
}