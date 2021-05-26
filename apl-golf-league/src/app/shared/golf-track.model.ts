import { GolfTeeSet } from "./golf-tee-set.model";

export interface GolfTrack {
  id: number;
  courseId: number;
  name: string;
  abbreviation: string;
  teeSets?: GolfTeeSet[];
}
