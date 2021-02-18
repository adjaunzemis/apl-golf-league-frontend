export interface GolfCourse {
  id: number
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
  dateUpdated?: Date;

  par?: number;
}

export interface GolfHole {
  courseID: number;
  number: number;
  par: number;
  handicap: number;
  yardage: number;
  dateUpdated?: Date;
}

export interface GolfHoleResult {
  roundID: number;
  hole: GolfHole;
  grossScore: number;
  adjustedGrossScore: number;
  netScore: number;
  dateUpdated?: Date;
}

export interface GolfRound {
  id: number;
  course: GolfCourse;
  player: GolfPlayer;
  datePlayed: Date;
  playerHandicapIndex: number;
  playerCourseHandicap: number;
  grossScore: number;
  adjustedGrossScore: number;
  netScore: number;
  scoreDifferential: number;
  dateUpdated?: Date;

  holeResults: GolfHoleResult[];
}

export interface GolfPlayer {
  id: number;
  firstName: string;
  lastName: string;
  classification: string;
  email: string;
  phone?: string;
  location?: string;
  employeeID?: string;
  dateUpdated?: Date;
}
