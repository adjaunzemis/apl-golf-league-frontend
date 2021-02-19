import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoundsComponent } from './rounds/rounds.component';

const routes: Routes = [
  { path: '', component: RoundsComponent },
  { path: 'rounds', component: RoundsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
