export interface GolfCourse {
  courseName: string;
  holes: GolfHole[];
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
}

export interface GolfPlayer {
  firstName: string;
  lastName: string;
}
