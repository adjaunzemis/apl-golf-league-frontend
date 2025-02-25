export enum Committee {
  LEAGUE="LEAGUE",
  EXECUTIVE="EXECUTIVE",
  RULES="RULES",
  TOURNAMENT="TOURNAMENT",
  BANQUET_AND_AWARDS="BANQUET_AND_AWARDS",
  PUBLICITY="PUBLICITY",
  PLANNING="PLANNING",
}

export interface Officer {
  name: string;
  year: number;
  committee: Committee;
  role: string;
  email?: string;
  phone?: string;
}
