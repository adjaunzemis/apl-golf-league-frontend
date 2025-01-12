import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TournamentsService } from '../tournaments.service';
import { TournamentCreate, TournamentData } from '../../shared/tournament.model';
import { RoundData } from '../../shared/round.model';
import { TournamentTeamData } from '../../shared/team.model';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/user.model';
import { TournamentCreateComponent } from '../tournament-create/tournament-create.component';

@Component({
    selector: 'app-tournament-home',
    templateUrl: './tournament-home.component.html',
    styleUrls: ['./tournament-home.component.css'],
    standalone: false
})
export class TournamentHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  isAuthenticated = false;
  private userSub: Subscription;
  currentUser: User | null = null;

  showScorecard = false;

  tournament: TournamentData;
  private tournamentSub: Subscription;

  rounds: RoundData[] = [];

  focusedTeam: TournamentTeamData;

  currentDate = new Date();

  constructor(private tournamentsService: TournamentsService, private authService: AuthService, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;
      }
    });

    this.tournamentSub = this.tournamentsService.getTournamentUpdateListener()
      .subscribe(tournamentData => {
          console.log(`[TournamentHomeComponent] Received data for tournament: name=${tournamentData.name}, year=${tournamentData.year}, id=${tournamentData.id}`);
          this.tournament = tournamentData;
          this.compileRoundData();
          this.isLoading = false;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
          if (params.id) {
              console.log("[TournamentHomeComponent] Processing route with query parameter: id=" + params.id);
              this.tournamentsService.getTournament(params.id);
          }
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.tournamentSub.unsubscribe();
  }

  getTournamentEmailList(): string {
    let emailList = "";
    if (this.tournament.secretary_email) {
      emailList += this.tournament.secretary_email + ";"
    }
    if (this.tournament.teams) {
      for (const team of this.tournament.teams) {
        for (const golfer of team.golfers) {
          if (golfer.golfer_email) {
            emailList += golfer.golfer_email + ";"
          }
        }
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }

  focusTeam(team: TournamentTeamData): void {
    if (this.showScorecard && this.focusedTeam === team) {
      this.showScorecard = false;
      return;
    }
    this.focusedTeam = team;
    this.showScorecard = true;
  }

  private compileRoundData(): void {
    for (let team of this.tournament.teams) {
      if (team.rounds) {
        for (let round of team.rounds) {
          this.rounds.push(round);
        }
      }
    }
  }

  // TODO: Move to admin view?
  // TODO: Conslidate with header onAddNewTournament
  onManageTournament(): void {
    const dialogRef = this.dialog.open(TournamentCreateComponent, {
      width: '900px',
      data: this.tournament as TournamentCreate
    });

    dialogRef.afterClosed().subscribe(tournamentData => {
      if (tournamentData !== null && tournamentData !== undefined) {
        this.tournamentsService.updateTournament(tournamentData).subscribe(result => {
          console.log(`[TournamentHomeComponent] Successfully updated tournament: ${result.name} (${result.year})`);
          this.snackBar.open(`Successfully updated tournament: ${result.name} (${result.year})`, undefined, {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          this.tournamentsService.getTournament(this.tournament.id); // refresh tournament data
        });
      }
    });
  }

}
