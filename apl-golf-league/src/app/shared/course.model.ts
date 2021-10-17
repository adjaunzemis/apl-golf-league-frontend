import { Track } from "./track.model";

export interface Course {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  date_updated?: Date;
  tracks?: Track[];
}
