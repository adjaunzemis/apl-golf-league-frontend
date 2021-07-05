import { GolfTeeSet } from "./golf-tee-set.model";

export interface GolfTrack {
  track_id: number;
  course_id: number;
  name: string;
  tee_sets?: GolfTeeSet[];
}
