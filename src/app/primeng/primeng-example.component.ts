import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';


@Component({
    selector: 'app-example',
    standalone: true,
    imports: [CommonModule, TableModule, ChartModule, ButtonModule, CardModule, AccordionModule],
    templateUrl: './primeng-example.component.html',
    styleUrls: ['./primeng-example.component.css']
  })
export class PrimeNGExampleComponent {
    standings = [
      { name: 'Tiger Woods', handicap: -5, wins: 3 },
      { name: 'Phil Mickelson', handicap: 1, wins: 2 },
      { name: 'Rory McIlroy', handicap: -3, wins: 4 }
    ];
  
    leaderboard = [
      { rank: 1, name: 'Tiger Woods', points: 500 },
      { rank: 2, name: 'Rory McIlroy', points: 450 },
      { rank: 3, name: 'Phil Mickelson', points: 400 }
    ];
  
    chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        { label: 'Tiger Woods', data: [-5, -4, -6, -5, -7], borderColor: '#42A5F5' },
        { label: 'Phil Mickelson', data: [1, 2, 0, 1, -1], borderColor: '#FFA726' }
      ]
    };
  
    matches = [
      { player1: 'Tiger Woods', player2: 'Phil Mickelson' },
      { player1: 'Rory McIlroy', player2: 'Dustin Johnson' }
    ];
  
    matchHistory = [
      { date: '2025-01-10', player1: 'Tiger Woods', player2: 'Phil Mickelson', winner: 'Tiger Woods' },
      { date: '2025-01-15', player1: 'Rory McIlroy', player2: 'Dustin Johnson', winner: 'Rory McIlroy' }
    ];
  
    playerProfiles = [
      { name: 'Tiger Woods', handicap: -5, wins: 3, image: 'assets/tiger.jpg' },
      { name: 'Phil Mickelson', handicap: 1, wins: 2, image: 'assets/phil.jpg' }
    ];
  }
