export enum FreeAgentCadence {
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Biweekly',
  MONTHLY = 'Monthly',
  OCCASIONALLY = 'Occasionally',
}

export interface FlightFreeAgent {
  flight_id: number;
  golfer_id: number;
  division_id: number;
  cadence: FreeAgentCadence;
}

export interface TournamentFreeAgent {
  tournament_id: number;
  golfer_id: number;
  division_id: number;
}
