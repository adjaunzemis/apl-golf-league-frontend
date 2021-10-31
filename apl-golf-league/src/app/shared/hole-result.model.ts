import { Hole } from "./hole.model";

export interface HoleResult {
  id: number;
  round_id: number;
  hole: Hole;
  strokes: number;
}

export interface HoleResultSummary {
  hole_result_id: number;
  round_id: number;
  hole_number: number;
  hole_par: number;
  hole_yardage: number;
  hole_stroke_index: number;
  hole_result_strokes: number;
}
