import { GolfHoleResult, GolfCourse, GolfHole, GolfRound, GolfPlayer } from './golf-models';

export const MOCK_COURSE_HOLES: GolfHole[] = [
  {"number": 1, "par": 5, "handicap": 9, "yardage": 510},
  {"number": 2, "par": 4, "handicap": 8, "yardage": 380},
  {"number": 3, "par": 5, "handicap": 7, "yardage": 510},
  {"number": 4, "par": 3, "handicap": 6, "yardage": 155},
  {"number": 5, "par": 4, "handicap": 5, "yardage": 380},
  {"number": 6, "par": 4, "handicap": 4, "yardage": 380},
  {"number": 7, "par": 3, "handicap": 3, "yardage": 155},
  {"number": 8, "par": 4, "handicap": 2, "yardage": 380},
  {"number": 9, "par": 5, "handicap": 1, "yardage": 510}
];

export const MOCK_PLAYER: GolfPlayer = {"firstName": "Mock", "lastName": "Player"};

export const MOCK_COURSE: GolfCourse = {"courseName": "Mock Course Data", "holes": MOCK_COURSE_HOLES};

export const MOCK_ROUND_HOLE_RESULTS: GolfHoleResult[] = [
  {"hole": MOCK_COURSE_HOLES[0], "grossScore": 2, "netScore": 2},
  {"hole": MOCK_COURSE_HOLES[1], "grossScore": 2, "netScore": 2},
  {"hole": MOCK_COURSE_HOLES[2], "grossScore": 4, "netScore": 4},
  {"hole": MOCK_COURSE_HOLES[3], "grossScore": 4, "netScore": 4},
  {"hole": MOCK_COURSE_HOLES[4], "grossScore": 4, "netScore": 4},
  {"hole": MOCK_COURSE_HOLES[5], "grossScore": 6, "netScore": 6},
  {"hole": MOCK_COURSE_HOLES[6], "grossScore": 7, "netScore": 7},
  {"hole": MOCK_COURSE_HOLES[7], "grossScore": 3, "netScore": 4},
  {"hole": MOCK_COURSE_HOLES[8], "grossScore": 4, "netScore": 3}
];

export const MOCK_ROUND: GolfRound = {"course": MOCK_COURSE, "player": MOCK_PLAYER, "datePlayed": new Date(), "playerHandicapIndex": 16.2, "holeResults": MOCK_ROUND_HOLE_RESULTS};
