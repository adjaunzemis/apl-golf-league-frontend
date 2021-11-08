import { PlayerData } from "./player.model"

export class TeamData {
    team_id: number
    flight_id: number
    name: string
    players?: PlayerData[]
}
