import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { RoundListComponent } from './round-list/round-list.component';
import { RoundDetailComponent } from './round-detail/round-detail.component';
import { RoundsComponent } from './rounds/rounds.component';
import { RoundItemComponent } from './round-item/round-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ScorecardComponent,
    RoundListComponent,
    RoundDetailComponent,
    RoundsComponent,
    RoundItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
