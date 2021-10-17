import { Hole } from "./hole.model";

export interface Tee {
  id: number;
  track_id: number;
  name: string;
  color: string;
  gender: string;
  rating: number;
  slope: number;
  holes?: Hole[];
}
