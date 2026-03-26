import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeasonsService } from '../seasons.service';
import { Season } from '../../shared/season.model';
import { NotificationService } from '../../notifications/notification.service';
import { PrimeNGModule } from '../../primeng.module';
import { OfficersService } from '../../officers/officers.service';
import { Committee, Officer } from '../../shared/officer.model';
import { GolfersService } from '../../golfers/golfers.service';
import { Golfer } from '../../shared/golfer.model';

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

  // Officer Management
  officers: Officer[] = [];
  selectedYearForOfficers: number;
  golfers: Golfer[] = [];
  committees = Object.values(Committee);
  displayOfficerDialog = false;
  editingOfficer: Officer | null = null;
  newOfficer: Partial<Officer> = {};

  // Stub for League Dues
  leagueDues = [
    { type: 'Regular', amount: 50 },
    { type: 'Senior', amount: 30 },
  ];

  private seasonsService = inject(SeasonsService);
  private officersService = inject(OfficersService);
  private golfersService = inject(GolfersService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadSeasons();
    this.loadGolfers();
  }

  loadSeasons(): void {
    this.loading = true;
    this.seasonsService.getSeasons().subscribe({
      next: (seasons) => {
        this.seasons = [...seasons].sort((a, b) => b.year - a.year);
        if (this.seasons.length > 0 && !this.selectedYearForOfficers) {
          const active = this.seasons.find((s) => s.is_active) || this.seasons[0];
          this.selectedYearForOfficers = active.year;
          this.loadOfficers();
        }
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error', 'Failed to load seasons');
        this.loading = false;
      },
    });
  }

  loadGolfers(): void {
    this.golfersService.getAllGolfers();
    this.golfersService.getAllGolfersUpdateListener().subscribe((golfers) => {
      this.golfers = golfers;
    });
  }

  loadOfficers(): void {
    if (!this.selectedYearForOfficers) return;
    this.loading = true;
    this.officersService.getOfficersListObservable(this.selectedYearForOfficers).subscribe({
      next: (officers) => {
        this.officers = officers;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error', 'Failed to load officers');
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

  // Officer methods
  showAddOfficerDialog(): void {
    this.editingOfficer = null;
    this.newOfficer = {
      year: this.selectedYearForOfficers,
      committee: Committee.LEAGUE,
    };
    this.displayOfficerDialog = true;
  }

  showEditOfficerDialog(officer: Officer): void {
    this.editingOfficer = officer;
    this.newOfficer = { ...officer };
    this.displayOfficerDialog = true;
  }

  onSaveOfficer(): void {
    if (!this.newOfficer.role || (!this.newOfficer.name && !this.newOfficer.golfer_id)) {
      this.notificationService.showError('Error', 'Please fill in required fields');
      return;
    }

    if (this.newOfficer.golfer_id) {
      const golfer = this.golfers.find((g) => g.id === this.newOfficer.golfer_id);
      if (golfer) {
        this.newOfficer.name = golfer.name;
        this.newOfficer.email = golfer.email;
        this.newOfficer.phone = golfer.phone;
      }
    }

    if (this.editingOfficer && this.editingOfficer.id) {
      this.officersService.updateOfficer(this.editingOfficer.id, this.newOfficer).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'Officer updated');
          this.displayOfficerDialog = false;
          this.loadOfficers();
        },
        error: (err) => {
          this.notificationService.showError(
            'Error',
            err.error?.detail || 'Failed to update officer',
          );
        },
      });
    } else {
      this.officersService.createOfficer(this.newOfficer as Officer).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'Officer created');
          this.displayOfficerDialog = false;
          this.loadOfficers();
        },
        error: (err) => {
          this.notificationService.showError(
            'Error',
            err.error?.detail || 'Failed to create officer',
          );
        },
      });
    }
  }
}
