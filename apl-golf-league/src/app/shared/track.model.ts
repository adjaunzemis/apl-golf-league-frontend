import { Tee } from "./tee.model";

export interface Track {
  id: number;
  course_id: number;
  name: string;
  tees: Tee[];
}
