import { GolfHoleResult, GolfCourse, GolfHole, GolfRound, GolfPlayer } from './golf-models';

export const MOCK_COURSE_HOLES = [
  new GolfHole(1, 5, 9, 510),
  new GolfHole(2, 4, 8, 380),
  new GolfHole(3, 5, 7, 510),
  new GolfHole(4, 4, 6, 380),
  new GolfHole(5, 3, 5, 155),
  new GolfHole(6, 4, 4, 380),
  new GolfHole(7, 4, 3, 380),
  new GolfHole(8, 3, 2, 155),
  new GolfHole(9, 4, 1, 380)
];

export const MOCK_PLAYER = new GolfPlayer("Mock", "Player");

export const MOCK_COURSE = new GolfCourse("Mock Course Data", MOCK_COURSE_HOLES);

export const MOCK_ROUND_HOLE_RESULTS = [
  new GolfHoleResult(MOCK_COURSE_HOLES[0], 2, 2),
  new GolfHoleResult(MOCK_COURSE_HOLES[1], 2, 2),
  new GolfHoleResult(MOCK_COURSE_HOLES[2], 4, 4),
  new GolfHoleResult(MOCK_COURSE_HOLES[3], 4, 4),
  new GolfHoleResult(MOCK_COURSE_HOLES[4], 4, 4),
  new GolfHoleResult(MOCK_COURSE_HOLES[5], 6, 6),
  new GolfHoleResult(MOCK_COURSE_HOLES[6], 7, 7),
  new GolfHoleResult(MOCK_COURSE_HOLES[7], 3, 4),
  new GolfHoleResult(MOCK_COURSE_HOLES[8], 4, 3),
];

export const MOCK_ROUND = new GolfRound(MOCK_COURSE, MOCK_PLAYER, new Date(), 16.2, MOCK_ROUND_HOLE_RESULTS);
