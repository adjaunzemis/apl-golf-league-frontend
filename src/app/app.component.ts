import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'APL Golf League';

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
