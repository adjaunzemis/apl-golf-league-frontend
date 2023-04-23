import { Track, TrackData } from "./track.model";

export interface Course {
  id: number;
  name: string;
  year: number;
  address?: string;
  phone?: string;
  website?: string;
  date_updated?: Date;
  tracks: Track[];
}

export interface CourseData {
  id?: number;
  name: string;
  year: number;
  address?: string;
  phone?: string;
  website?: string;
  date_updated?: Date;
  tracks: TrackData[];
}
