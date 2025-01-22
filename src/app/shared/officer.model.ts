export enum Committee {
  LEAGUE,
  EXECUTIVE,
  RULES,
  TOURNAMENT,
  BANQUET_AND_AWARDS,
  PUBLICITY,
  PLANNING
}

export interface Officer {
  name: string
  year: number
  committee: Committee
  role: string
  email?: string
  phone?: string
}
