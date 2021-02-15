export class GolfCourse {
  courseName: string;
  holes: GolfHole[];

  constructor(courseName: string, holes: GolfHole[]) {
    this.courseName = courseName;
    this.holes = holes;
  }
}

export class GolfHole {
  number: number;
  par: number;
  handicap: number;
  yardage: number;

  constructor(number: number, par: number, handicap: number, yardage: number) {
    this.number = number;
    this.par = par;
    this.handicap = handicap;
    this.yardage = yardage;

  }
}

export class GolfHoleResult {
  hole: GolfHole;
  grossScore: number;
  netScore: number;
  handicapStrokes: number;

  constructor(hole: GolfHole, grossScore: number, netScore: number) {
    this.hole = hole;
    this.grossScore = grossScore;
    this.netScore = netScore;

    this.handicapStrokes = grossScore - netScore;
  }
}

export class GolfRound {
  course: GolfCourse;
  player: GolfPlayer;
  datePlayed: Date;
  playerHandicapIndex: number;
  holeResults: GolfHoleResult[];

  constructor(course: GolfCourse, player: GolfPlayer, datePlayed: Date, playerHandicapIndex: number, holeResults: GolfHoleResult[]) {
    this.course = course;
    this.player = player;
    this.datePlayed = datePlayed;
    this.playerHandicapIndex = playerHandicapIndex;
    this.holeResults = holeResults;
  }
}

export class GolfPlayer {
  firstName: string;
  lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

}
