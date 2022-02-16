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

// TODO: Add to database, load from there
export const MOCK_OFFICERS: Officer[] = [
  { name: "John Landshof", year: 2021, committee: Committee.LEAGUE, role: "President", email: "John.Landshof@jhuapl.edu" },
  { name: "Richie Steinwand", year: 2021, committee: Committee.LEAGUE, role: "Vice-President", email: "Richard.Steinwand@jhuapl.edu" },
  { name: "Bob Erlandson", year: 2021, committee: Committee.LEAGUE, role: "Treasurer", email: "Bob.Erlandson@jhuapl.edu" },
  { name: "Andris Jaunzemis", year: 2021, committee: Committee.LEAGUE, role: "Handicapper", email: "Andris.Jaunzemis@jhuapl.edu" },
  { name: "Eric Crossley", year: 2021, committee: Committee.RULES, role: "Chair", email: "Eric.Crossley@jhuapl.edu" },
  { name: "Gary Gafke", year: 2021, committee: Committee.RULES, role:"Member", email: "ggafke@gmail.com" },
  { name: "Mark Mathews", year: 2021, committee: Committee.RULES, role:"Member", email: "Mark.Mathews@jhuapl.edu" }
];
