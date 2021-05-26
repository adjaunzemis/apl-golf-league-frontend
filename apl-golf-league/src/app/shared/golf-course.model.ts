import { GolfTrack } from "./golf-track.model";

export interface GolfCourse {
  id: number;
  name: string;
  abbreviation: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  phone?: string;
  website?: string;
  dateUpdated?: Date;
  tracks?: GolfTrack[];
}
