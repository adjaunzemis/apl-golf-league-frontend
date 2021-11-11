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
