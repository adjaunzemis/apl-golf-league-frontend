import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../shared/user.model';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  currentUser: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
    this.currentUser = null;
  }

}
