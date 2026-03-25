import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeasonsService } from '../seasons.service';
import { Season } from '../../shared/season.model';
import { NotificationService } from '../../notifications/notification.service';
import { PrimeNGModule } from '../../primeng.module';

@Component({
  selector: 'app-season-setup',
  templateUrl: './season-setup.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeNGModule],
})
export class SeasonSetupComponent implements OnInit {
  seasons: Season[] = [];
  newSeasonYear: number = new Date().getFullYear() + 1;
  loading = false;

  // Stub for League Dues
  leagueDues = [
    { type: 'Regular', amount: 50 },
    { type: 'Senior', amount: 30 },
  ];

  private seasonsService = inject(SeasonsService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.loading = true;
    this.seasonsService.getSeasons().subscribe({
      next: (seasons) => {
        this.seasons = [...seasons].sort((a, b) => b.year - a.year);
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error', 'Failed to load seasons');
        this.loading = false;
      },
    });
  }

  onCreateSeason(): void {
    if (!this.newSeasonYear) return;
    this.seasonsService.createSeason(this.newSeasonYear).subscribe({
      next: () => {
        this.notificationService.showSuccess('Success', `Season ${this.newSeasonYear} created`);
        this.loadSeasons();
      },
      error: (err) => {
        this.notificationService.showError('Error', err.error?.detail || 'Failed to create season');
      },
    });
  }

  onSetActiveSeason(year: number): void {
    this.seasonsService.setActiveSeason(year).subscribe({
      next: () => {
        this.notificationService.showSuccess('Success', `Season ${year} is now active`);
        this.loadSeasons();
      },
      error: () => {
        this.notificationService.showError('Error', 'Failed to set active season');
      },
    });
  }
}
