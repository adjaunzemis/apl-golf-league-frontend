import { GolfHole } from "./golf-hole.model";

export interface GolfTeeSet {
  id: number;
  trackId: number;
  name: string;
  color: string;
  gender: string;
  rating: number;
  slope: number;
  holes?: GolfHole[];
}
