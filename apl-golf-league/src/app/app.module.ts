import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { DivisionsModule } from './divisions/divisions.module';
import { AuthModule } from './auth/auth.module';
import { ErrorInterceptor } from './shared/error/error-interceptor';
import { AppConfigService } from './app-config.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

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
    AppRoutingModule,
    AngularMaterialModule,
    CoursesModule,
    RoundsModule,
    FlightsModule,
    GolfersModule,
    MatchesModule,
    TournamentsModule,
    DivisionsModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          return appConfigService.loadAppConfig();
        };
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptorService
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ErrorInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
