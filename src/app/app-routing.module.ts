import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { LeagueHomeComponent } from './league-home/league-home.component';
import { FlightMatchScorecardComponent } from './flights/flight-match-create/flight-match-scorecard.component';
import { FlightMatchCreateComponent } from './flights/flight-match-create/flight-match-create.component';
import { GolferHomeComponent } from './golfers/golfer-home/golfer-home.component';
import { LoginComponent } from './auth/login/login.component';
import { HandicapsComponent } from './handicaps/handicaps.component';
import { GolferSearchComponent } from './golfers/golfer-search/golfer-search.component';
import { PrimeNGExampleComponent } from './primeng/primeng-example.component';
import { FlightHomeComponent } from './flights/flight-home/flight-home.component';
import { TeamHomeComponent } from './flights/team-home/team-home.component';
import { FlightSignupComponent } from './flights/flight-signup/flight-signup.component';
import { TournamentSignupComponent } from './tournaments/tournament-signup/tournament-signup.component';
import { TournamentHomeComponent } from './tournaments/tournament-home/tournament-home.component';
import { UnderConstructionComponent } from './maintenance/under-construction/under-construction.component';
import { UnderConstructionGuard } from './maintenance/under-construction/under-construction.guard';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceGuard } from './maintenance/maintenance.guard';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'maintenance', component: MaintenanceComponent},
  {
    path: '',
    canActivateChild: [MaintenanceGuard],
    children: [
      { path: '', component: LeagueHomeComponent },
      { path: 'under-construction', component: UnderConstructionComponent },
      { path: 'flight', component: FlightHomeComponent },
      { path: 'flight-signup', component: FlightSignupComponent },
      { path: 'flight-team', component: TeamHomeComponent },
      { path: 'flight-scorecard', component: FlightMatchScorecardComponent },
      {
        path: 'flight-scorecard/edit',
        component: FlightMatchCreateComponent,
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'dues-payments',
      //   component: LeagueDuesPaymentsListComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'fee-payments',
      //   component: TournamentEntryFeePaymentsListComponent,
      //   canActivate: [AuthGuard],
      // },
      { path: 'tournament', component: TournamentHomeComponent },
      { path: 'tournament-signup', component: TournamentSignupComponent },
      // {
      //   path: 'tournament/scores',
      //   component: TournamentScorecardCreateComponent,
      //   canActivate: [AuthGuard],
      // },
      { path: 'golfer', component: GolferHomeComponent },
      { path: 'golfer-search', component: GolferSearchComponent },
      // {
      //   path: 'golfer/qualifying',
      //   component: AddQualifyingScoreComponent,
      //   canActivate: [AuthGuard],
      // },
      // { path: 'courses', component: CourseListComponent, canActivate: [UnderConstructionGuard] },
      // { path: 'courses/edit', component: CourseCreateComponent, canActivate: [AuthGuard] },
      { path: 'auth/login', component: LoginComponent },
      // {
      //   path: 'auth/manage',
      //   component: UserManageComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'auth/user',
      //   component: UserHomeComponent,
      //   canActivate: [AuthGuard],
      // },
      { path: 'handicaps', component: HandicapsComponent, canActivate: [UnderConstructionGuard] },
      { path: 'primeng-example', component: PrimeNGExampleComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: '**', redirectTo: '' },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
