export interface Hole {
  id: number;
  tee_id?: number;
  number: number;
  par: number;
  stroke_index: number;
  yardage: number;
}

export interface HoleData {
  id?: number;
  tee_id?: number;
  number: number;
  par: number;
  stroke_index: number;
  yardage: number;
}
