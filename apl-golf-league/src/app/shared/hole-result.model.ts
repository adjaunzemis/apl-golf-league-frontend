import { Hole } from "./hole.model";

export interface HoleResult {
  id: number;
  round_id: number;
  hole: Hole;
  strokes: number;
}
