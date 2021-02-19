import { GolfCourse, GolfHole, GolfRound, GolfPlayer } from './golf-models';

export const MOCK_PLAYER: GolfPlayer = {
  id: 1,
  firstName: "Mock",
  lastName: "Player",
  classification: "APL_EMPLOYEE",
  email: "test@testing.com"
};

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

export const MOCK_ROUND: GolfRound = {
  id: 1,
  course: MOCK_COURSE,
  player: MOCK_PLAYER,
  datePlayed: new Date(),
  playerHandicapIndex: 16.2,
  playerCourseHandicap: 0,
  grossScore: 36,
  adjustedGrossScore: 35,
  netScore: 35,
  scoreDifferential: -2,
  holeResults: [
    {roundID: 1, hole: MOCK_COURSE.holes[0], grossScore: 5, adjustedGrossScore: 5, netScore: 5},
    {roundID: 1, hole: MOCK_COURSE.holes[1], grossScore: 7, adjustedGrossScore: 6, netScore: 6},
    {roundID: 1, hole: MOCK_COURSE.holes[2], grossScore: 1, adjustedGrossScore: 1, netScore: 1},
    {roundID: 1, hole: MOCK_COURSE.holes[3], grossScore: 3, adjustedGrossScore: 3, netScore: 3},
    {roundID: 1, hole: MOCK_COURSE.holes[4], grossScore: 3, adjustedGrossScore: 3, netScore: 3},
    {roundID: 1, hole: MOCK_COURSE.holes[5], grossScore: 2, adjustedGrossScore: 2, netScore: 2},
    {roundID: 1, hole: MOCK_COURSE.holes[6], grossScore: 6, adjustedGrossScore: 6, netScore: 6},
    {roundID: 1, hole: MOCK_COURSE.holes[7], grossScore: 5, adjustedGrossScore: 5, netScore: 5},
    {roundID: 1, hole: MOCK_COURSE.holes[8], grossScore: 4, adjustedGrossScore: 4, netScore: 4}
  ]
}

export const WOODHOLME_FRONT_COURSE: GolfCourse = {'id': 1, 'courseName': 'Woodholme Country Club', 'trackName': 'Front', 'teeName': 'Blue', 'gender': 'M', 'rating': 34.8, 'slope': 133, 'holes': [{'courseID': 1, 'number': 1, 'par': 4, 'handicap': 17, 'yardage': 325}, {'courseID': 1, 'number': 2, 'par': 5, 'handicap': 7, 'yardage': 529}, {'courseID': 1, 'number': 3, 'par': 3, 'handicap': 11, 'yardage': 167}, {'courseID': 1, 'number': 4, 'par': 4, 'handicap': 1, 'yardage': 401}, {'courseID': 1, 'number': 5, 'par': 3, 'handicap': 13, 'yardage': 186}, {'courseID': 1, 'number': 6, 'par': 4, 'handicap': 5, 'yardage': 404}, {'courseID': 1, 'number': 7, 'par': 4, 'handicap': 9, 'yardage': 337}, {'courseID': 1, 'number': 8, 'par': 4, 'handicap': 15, 'yardage': 306}, {'courseID': 1, 'number': 9, 'par': 4, 'handicap': 3, 'yardage': 366}], 'par': 35, 'abbreviation': 'WCCF', 'city': 'Pikesville', 'state': 'MD', 'dateUpdated': '2021-02-18'}

export const WOODHOLME_FRONT_ROUND: GolfRound = {
  id: 2,
  course: WOODHOLME_FRONT_COURSE,
  player: MOCK_PLAYER,
  datePlayed: new Date('2020-10-24'),
  playerHandicapIndex: 16.2,
  playerCourseHandicap: 18,
  grossScore: 43,
  adjustedGrossScore: 42,
  netScore: 33,
  scoreDifferential: -2,
  holeResults: [
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[0], grossScore: 5, adjustedGrossScore: 5, netScore: 4},
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[1], grossScore: 6, adjustedGrossScore: 6, netScore: 5},
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[2], grossScore: 7, adjustedGrossScore: 6, netScore: 5},
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[3], grossScore: 3, adjustedGrossScore: 3, netScore: 2},
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[4], grossScore: 5, adjustedGrossScore: 5, netScore: 4},
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[5], grossScore: 4, adjustedGrossScore: 4, netScore: 3},
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[6], grossScore: 6, adjustedGrossScore: 6, netScore: 5},
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[7], grossScore: 3, adjustedGrossScore: 3, netScore: 2},
    {roundID: 2, hole: WOODHOLME_FRONT_COURSE.holes[8], grossScore: 4, adjustedGrossScore: 4, netScore: 3}
  ]
};

export const DIAMOND_RIDGE_FRONT_COURSE: GolfCourse = {'id': 153, 'courseName': 'Diamond Ridge Golf Course', 'trackName': 'Front', 'teeName': 'middle', 'gender': 'M', 'rating': 35.05, 'slope': 122.0, 'holes': [{'courseID': 153, 'number': 1, 'par': 4, 'handicap': 7, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 153, 'number': 2, 'par': 4, 'handicap': 5, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 153, 'number': 3, 'par': 4, 'handicap': 1, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 153, 'number': 4, 'par': 4, 'handicap': 11, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 153, 'number': 5, 'par': 3, 'handicap': 3, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 153, 'number': 6, 'par': 4, 'handicap': 9, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 153, 'number': 7, 'par': 4, 'handicap': 13, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 153, 'number': 8, 'par': 3, 'handicap': 17, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 153, 'number': 9, 'par': 5, 'handicap': 15, 'yardage': 0, 'dateUpdated': '2021-02-12'}], 'par': 35, 'abbreviation': 'DRF', 'address': '2309 Ridge Rd', 'city': 'Windsor Mill', 'state': 'MD'};

export const TIMBERS_FRONT_COURSE: GolfCourse = {'id': 137, 'courseName': 'Timbers at Troy Golf Course', 'trackName': 'Front', 'teeName': 'middle', 'gender': 'M', 'rating': 35.0, 'slope': 133.0, 'holes': [{'courseID': 137, 'number': 1, 'par': 4, 'handicap': 3, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 137, 'number': 2, 'par': 5, 'handicap': 5, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 137, 'number': 3, 'par': 4, 'handicap': 7, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 137, 'number': 4, 'par': 4, 'handicap': 15, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 137, 'number': 5, 'par': 3, 'handicap': 11, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 137, 'number': 6, 'par': 4, 'handicap': 17, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 137, 'number': 7, 'par': 4, 'handicap': 9, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 137, 'number': 8, 'par': 3, 'handicap': 13, 'yardage': 0, 'dateUpdated': '2021-02-12'}, {'courseID': 137, 'number': 9, 'par': 5, 'handicap': 1, 'yardage': 0, 'dateUpdated': '2021-02-12'}], 'par': 36, 'abbreviation': 'TATF', 'address': 'Ellicott City', 'city': 'MD'};

export const TIMBERS_FRONT_ROUND: GolfRound = {
  id: 3,
  course: TIMBERS_FRONT_COURSE,
  player: MOCK_PLAYER,
  datePlayed: new Date('2020-07-14'),
  playerHandicapIndex: 16.2,
  playerCourseHandicap: 18,
  grossScore: 38,
  adjustedGrossScore: 38,
  netScore: 29,
  scoreDifferential: -7,
  holeResults: [
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[0], grossScore: 4, adjustedGrossScore: 4, netScore: 3},
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[1], grossScore: 5, adjustedGrossScore: 5, netScore: 4},
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[2], grossScore: 5, adjustedGrossScore: 5, netScore: 4},
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[3], grossScore: 5, adjustedGrossScore: 5, netScore: 4},
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[4], grossScore: 3, adjustedGrossScore: 3, netScore: 2},
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[5], grossScore: 6, adjustedGrossScore: 6, netScore: 5},
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[6], grossScore: 4, adjustedGrossScore: 4, netScore: 3},
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[7], grossScore: 2, adjustedGrossScore: 2, netScore: 1},
    {roundID: 3, hole: TIMBERS_FRONT_COURSE.holes[8], grossScore: 4, adjustedGrossScore: 4, netScore: 3}
  ]
}
