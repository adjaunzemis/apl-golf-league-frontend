import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { RoundListComponent } from './round-list/round-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ScorecardComponent,
    RoundListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
