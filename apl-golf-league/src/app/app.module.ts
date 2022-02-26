import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeagueHomeComponent } from './league-home/league-home.component';
import { RulesComponent } from './rules/rules.component';
import { HandicapsComponent } from './handicaps/handicaps.component';
import { CoursesModule } from './courses/courses.module';
import { RoundsModule } from './rounds/rounds.module';
import { FlightsModule } from './flights/flights.module';
import { GolfersModule } from './golfers/golfers.module';
import { MatchesModule } from './matches/matches.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { AuthModule } from './auth/auth.module';
import { ErrorInterceptor } from './shared/error/error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LeagueHomeComponent,
    RulesComponent,
    HandicapsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    AppRoutingModule,
    AngularMaterialModule,
    CoursesModule,
    RoundsModule,
    FlightsModule,
    GolfersModule,
    MatchesModule,
    TournamentsModule,
    AuthModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
