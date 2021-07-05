import { GolfHole } from "./golf-hole.model";

export interface GolfTeeSet {
  tee_set_id: number;
  track_id: number;
  name: string;
  color: string;
  gender: string;
  rating: number;
  slope: number;
  holes?: GolfHole[];
}
