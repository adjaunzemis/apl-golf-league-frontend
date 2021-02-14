import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScorecardComponent } from './scorecard/scorecard.component';

const routes: Routes = [
  { path: '', component: ScorecardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
