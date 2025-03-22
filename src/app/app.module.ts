import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import Material from '@primeng/themes/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeagueHomeComponent } from './league-home/league-home.component';
import { HandicapsComponent } from './handicaps/handicaps.component';
import { CoursesModule } from './courses/courses.module';
import { RoundsModule } from './rounds/rounds.module';
import { FlightsModule } from './flights/flights.module';
import { GolfersModule } from './golfers/golfers.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { DivisionsModule } from './divisions/divisions.module';
import { AuthModule } from './auth/auth.module';
import { ErrorInterceptor } from './shared/error/error-interceptor';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { PaymentsModule } from './payments/payments.module';
import { SignupComponent } from './signup/signup.component'; // TODO: Move to signup module
import { TeamCreateComponent } from './signup/team-create.component'; // TODO: Move to signup module
import { PrimeNGExampleComponent } from './primeng/primeng-example.component';
import { PrimeNGModule } from './primeng.module';
import { FlightsDashboardComponent } from './flights/flights-dashboard/flights-dashboard.component';
import { TournamentsDashboardComponent } from './tournaments/tournaments-dashboard/tournaments-dashboard.component';
import { OfficersDashboardComponent } from './officers/officers-dashboard/officers-dashboard.component';
import { RulesDashboardComponent } from './rules-dashboard/rules-dashboard.component';
import { AnnouncementsDashboardComponent } from './announcements-dashboard/announcements-dashboard.component';
import { GolferSearchComponent } from './golfers/golfer-search/golfer-search.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HandicapsComponent,
    SignupComponent,
    TeamCreateComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule,
    AppRoutingModule,
    AngularMaterialModule,
    CoursesModule,
    RoundsModule,
    FlightsModule,
    GolfersModule,
    TournamentsModule,
    DivisionsModule,
    AuthModule,
    PaymentsModule,
    PrimeNGExampleComponent,
    PrimeNGModule,
    LeagueHomeComponent,
    FlightsDashboardComponent,
    TournamentsDashboardComponent,
    OfficersDashboardComponent,
    RulesDashboardComponent,
    AnnouncementsDashboardComponent,
    GolferSearchComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptorService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ErrorInterceptor,
    },
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: Material,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
      ripple: true,
    }),
    MessageService,
  ],
})
export class AppModule {}
