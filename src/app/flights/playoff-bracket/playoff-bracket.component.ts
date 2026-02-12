import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

export interface Team {
  id: number;
  name: string;
  seed?: number;
}

export interface Match {
  id: number;
  round: number;
  team1?: Team;
  team2?: Team;
  winner?: Team;
  isBye?: boolean;
}

export interface Round {
  id: number;
  matches: Match[];
}

export interface Bracket {
  rounds: Round[];
}

@Component({
  selector: 'app-playoff-bracket',
  imports: [CommonModule, CardModule],
  template: `
    <div class="overflow-x-auto p-4">
      <div class="grid gap-8" [ngClass]="'grid-cols-' + bracket.rounds.length">
        @for (round of bracket.rounds; track round; let r = $index) {
          <div class="flex flex-col gap-6 items-center">
            <h3 class="text-lg font-semibold text-gray-700">Round {{ r + 1 }}</h3>

            @for (match of round.matches; track match) {
              <p-card class="w-48 relative group">
                <div class="flex flex-col gap-2">
                  <div
                    class="p-2 rounded bg-gray-100"
                    [class.bg-green-200]="match.winner?.id === match.team1?.id"
                  >
                    {{ match.team1?.name || 'TBD' }}
                  </div>
                  <div
                    class="p-2 rounded bg-gray-100"
                    [class.bg-green-200]="match.winner?.id === match.team2?.id"
                  >
                    {{ match.team2?.name || (match.isBye ? 'BYE' : 'TBD') }}
                  </div>
                </div>

                <!-- Example hover action -->
                <div
                  class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                >
                  <button class="px-2 py-1 bg-white rounded shadow">Details</button>
                </div>
              </p-card>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class PlayoffBracketComponent implements OnInit {
  @Input() bracket!: Bracket;

  ngOnInit(): void {
    this.bracket = {
      rounds: [
        {
          id: 1,
          matches: [
            { id: 1, round: 1, team1: { id: 1, name: 'Team A' }, team2: { id: 8, name: 'Team H' } },
            { id: 2, round: 1, team1: { id: 4, name: 'Team D' }, team2: { id: 5, name: 'Team E' } },
            { id: 3, round: 1, team1: { id: 3, name: 'Team C' }, team2: { id: 6, name: 'Team F' } },
            { id: 4, round: 1, team1: { id: 2, name: 'Team B' }, team2: { id: 7, name: 'Team G' } },
          ],
        },
        {
          id: 2,
          matches: [{ id: 5, round: 2, team1: undefined, team2: undefined }],
        },
      ],
    };
  }
}
