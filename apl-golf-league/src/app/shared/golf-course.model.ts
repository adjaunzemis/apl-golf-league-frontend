import { GolfTrack } from "./golf-track.model";

export interface GolfCourse {
  course_id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: number;
  phone?: string;
  website?: string;
  date_updated?: Date;
  tracks?: GolfTrack[];
}
