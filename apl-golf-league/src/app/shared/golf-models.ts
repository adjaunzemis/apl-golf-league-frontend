export interface GolfCourse {
  courseName: string;
  trackName: string;
  abbreviation: string;
  teeName: string;
  gender: string;
  rating: number;
  slope: number;
  holes: GolfHole[];

  teeColor?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  phone?: string;
  website?: string;

  par?: number;
}

export interface GolfHole {
  number: number;
  par: number;
  handicap: number;
  yardage: number;
}

export interface GolfHoleResult {
  hole: GolfHole;
  grossScore: number;
  netScore: number;
}

export interface GolfRound {
  course: GolfCourse;
  player: GolfPlayer;
  datePlayed: Date;
  playerHandicapIndex: number;
  holeResults: GolfHoleResult[];

  grossScore?: number;
  netScore?: number;
}

export interface GolfPlayer {
  firstName: string;
  lastName: string;
}
