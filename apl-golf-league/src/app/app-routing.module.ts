import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScorecardComponent } from './scorecard/scorecard.component';
import { RoundListComponent } from './round-list/round-list.component';

const routes: Routes = [
  { path: '', component: ScorecardComponent },
  { path: 'rounds', component: RoundListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
