import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from 'src/environments/environment';
import { AuthGuard } from './auth/auth.guard';
import { LeagueHomeComponent } from './league-home/league-home.component';
import { FlightMatchScorecardComponent } from './flights/flight-match-create/flight-match-scorecard.component';
import { FlightMatchCreateComponent } from './flights/flight-match-create/flight-match-create.component';
import { TournamentScorecardCreateComponent } from './tournaments/tournament-scorecard-create/tournament-scorecard-create.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseCreateComponent } from './courses/course-create/course-create.component';
import { GolferHomeComponent } from './golfers/golfer-home/golfer-home.component';
import { LoginComponent } from './auth/login/login.component';
import { UserManageComponent } from './auth/user-manage/user-manage.component';
import { UserHomeComponent } from './auth/user-home/user-home.component';
import { HandicapsComponent } from './handicaps/handicaps.component';
import { GolferSearchComponent } from './golfers/golfer-search/golfer-search.component';
import { LeagueDuesPaymentsListComponent } from './payments/league-dues-payments-list/league-dues-payments-list.component';
import { TournamentEntryFeePaymentsListComponent } from './payments/tournament-entry-fee-payments-list/tournament-entry-fee-payments-list.component';
import { AddQualifyingScoreComponent } from './golfers/add-qualifying-score/add-qualifying-score.component';
import { PrimeNGExampleComponent } from './primeng/primeng-example.component';
import { FlightHomeComponent } from './flights/flight-home/flight-home.component';
import { TeamHomeComponent } from './flights/team-home/team-home.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { FlightSignupComponent } from './flights/flight-signup/flight-signup.component';
import { TournamentSignupComponent } from './tournaments/tournament-signup/tournament-signup.component';
import { TournamentHomeComponent } from './tournaments/tournament-home/tournament-home.component';
import { UnderConstructionComponent } from './maintenance/under-construction/under-construction.component';
import { UnderConstructionGuard } from './maintenance/under-construction/under-construction.guard';

const routes: Routes = environment.maintenance
  ? [
      { path: 'maintenance', component: MaintenanceComponent },
      { path: '**', redirectTo: 'maintenance' },
    ]
  : [
      { path: '', component: LeagueHomeComponent },
      { path: 'under-construction', component: UnderConstructionComponent },
      { path: 'flight', component: FlightHomeComponent },
      { path: 'flight-signup', component: FlightSignupComponent },
      { path: 'flight-team', component: TeamHomeComponent },
      {
        path: 'flight-scorecard',
        component: FlightMatchScorecardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'flight/match/edit',
        component: FlightMatchCreateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dues-payments',
        component: LeagueDuesPaymentsListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'fee-payments',
        component: TournamentEntryFeePaymentsListComponent,
        canActivate: [AuthGuard],
      },
      { path: 'tournament', component: TournamentHomeComponent },
      { path: 'tournament-signup', component: TournamentSignupComponent },
      {
        path: 'tournament/scores',
        component: TournamentScorecardCreateComponent,
        canActivate: [AuthGuard],
      },
      { path: 'golfer', component: GolferHomeComponent, canActivate: [UnderConstructionGuard] },
      { path: 'golfer-search', component: GolferSearchComponent },
      {
        path: 'golfer/qualifying',
        component: AddQualifyingScoreComponent,
        canActivate: [AuthGuard],
      },
      { path: 'courses', component: CourseListComponent, canActivate: [UnderConstructionGuard] },
      { path: 'courses/edit', component: CourseCreateComponent, canActivate: [AuthGuard] },
      { path: 'auth/login', component: LoginComponent },
      {
        path: 'auth/manage',
        component: UserManageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'auth/user',
        component: UserHomeComponent,
        canActivate: [AuthGuard],
      },
      { path: 'handicaps', component: HandicapsComponent, canActivate: [UnderConstructionGuard] },
      { path: 'primeng-example', component: PrimeNGExampleComponent },
      { path: '**', redirectTo: '' },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
