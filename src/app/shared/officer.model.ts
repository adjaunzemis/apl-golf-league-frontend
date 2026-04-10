export enum Committee {
  LEAGUE = 'League',
  EXECUTIVE = 'Executive',
  RULES = 'Rules',
  TOURNAMENT = 'Tournament',
  BANQUET_AND_AWARDS = 'Banquet And Awards',
  PUBLICITY = 'Publicity',
  PLANNING = 'Planning',
}

export interface Officer {
  id?: number;
  golfer_id?: number;
  name: string;
  year: number;
  committee: Committee;
  role: string;
  email?: string;
  phone?: string;
}
