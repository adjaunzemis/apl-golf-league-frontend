import { GolfHoleResult, GolfCourse, GolfHole, GolfRound, GolfPlayer } from './golf-models';

export const MOCK_COURSE_HOLES: GolfHole[] = [
  {courseID: 1, number: 1, par: 5, handicap: 9, yardage: 510},
  {courseID: 1, number: 2, par: 4, handicap: 8, yardage: 380},
  {courseID: 1, number: 3, par: 5, handicap: 7, yardage: 510},
  {courseID: 1, number: 4, par: 3, handicap: 6, yardage: 155},
  {courseID: 1, number: 5, par: 4, handicap: 5, yardage: 380},
  {courseID: 1, number: 6, par: 4, handicap: 4, yardage: 380},
  {courseID: 1, number: 7, par: 3, handicap: 3, yardage: 155},
  {courseID: 1, number: 8, par: 4, handicap: 2, yardage: 380},
  {courseID: 1, number: 9, par: 5, handicap: 1, yardage: 510}
];

export const MOCK_PLAYER: GolfPlayer = {
  id: 1,
  firstName: "Mock",
  lastName: "Player",
  classification: "APL_EMPLOYEE",
  email: "test@testing.com"
};

export const MOCK_COURSE: GolfCourse = {
  id: 1,
  courseName: "Mock Course",
  trackName: "Front",
  abbreviation: "MCF",
  teeName: "White",
  gender: "M",
  rating: 72.1,
  slope: 132,
  holes: MOCK_COURSE_HOLES,
  par: 37
};

export const MOCK_COURSE_WOODHOLME: GolfCourse = {'id': 1, 'courseName': 'Woodholme Country Club', 'trackName': 'Front', 'teeName': 'Blue', 'gender': 'M', 'rating': 34.8, 'slope': 133, 'holes': [{'courseID': 1, 'number': 1, 'par': 4, 'handicap': 17, 'yardage': 325}, {'courseID': 1, 'number': 2, 'par': 5, 'handicap': 7, 'yardage': 529}, {'courseID': 1, 'number': 3, 'par': 3, 'handicap': 11, 'yardage': 167}, {'courseID': 1, 'number': 4, 'par': 4, 'handicap': 1, 'yardage': 401}, {'courseID': 1, 'number': 5, 'par': 3, 'handicap': 13, 'yardage': 186}, {'courseID': 1, 'number': 6, 'par': 4, 'handicap': 5, 'yardage': 404}, {'courseID': 1, 'number': 7, 'par': 4, 'handicap': 9, 'yardage': 337}, {'courseID': 1, 'number': 8, 'par': 4, 'handicap': 15, 'yardage': 306}, {'courseID': 1, 'number': 9, 'par': 4, 'handicap': 3, 'yardage': 366}], 'par': 35, 'abbreviation': 'WCCF'}

export const MOCK_ROUND_HOLE_RESULTS: GolfHoleResult[] = [
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[0], grossScore: 2, adjustedGrossScore:2, netScore: 2},
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[1], grossScore: 2, adjustedGrossScore:2, netScore: 2},
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[2], grossScore: 4, adjustedGrossScore:4, netScore: 4},
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[3], grossScore: 4, adjustedGrossScore:4, netScore: 4},
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[4], grossScore: 4, adjustedGrossScore:4, netScore: 4},
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[5], grossScore: 6, adjustedGrossScore:6, netScore: 6},
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[6], grossScore: 7, adjustedGrossScore:5, netScore: 5},
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[7], grossScore: 3, adjustedGrossScore:3, netScore: 4},
  {roundID: 1, hole: MOCK_COURSE_WOODHOLME.holes[8], grossScore: 4, adjustedGrossScore:4, netScore: 3}
];

export const MOCK_ROUND: GolfRound = {
  id: 1,
  course: MOCK_COURSE_WOODHOLME,
  player: MOCK_PLAYER,
  datePlayed: new Date(),
  playerHandicapIndex: 16.2,
  playerCourseHandicap: 14,
  grossScore: 36,
  adjustedGrossScore: 34,
  netScore: 34,
  scoreDifferential: -3,
  holeResults: MOCK_ROUND_HOLE_RESULTS,
};
