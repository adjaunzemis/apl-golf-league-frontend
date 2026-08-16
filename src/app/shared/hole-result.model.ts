import { Hole } from './hole.model';

export interface HoleResult {
  id: number;
  round_id: number;
  hole: Hole;
  strokes: number;
}

export interface HoleResultData {
  hole_result_id: number;
  round_id: number;
  tee_id: number;
  hole_id: number;
  number: number;
  par: number;
  yardage: number;
  stroke_index: number;
  handicap_strokes: number;
  gross_score: number;
  adjusted_gross_score: number;
  net_score: number;
}

export interface HoleResultValidationRequest {
  number: number;
  par: number;
  stroke_index: number;
  gross_score: number;
}

export interface HoleResultValidationResponse extends HoleResultValidationRequest {
  handicap_strokes: number;
  adjusted_gross_score: number;
  net_score: number;
  max_gross_score: number;
  is_valid: boolean;
}
