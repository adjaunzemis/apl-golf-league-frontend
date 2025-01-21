import { Tee, TeeData } from './tee.model';

export interface Track {
  id: number;
  course_id: number;
  name: string;
  tees: Tee[];
}

export interface TrackData {
  id?: number;
  course_id?: number;
  name: string;
  tees: TeeData[];
}
