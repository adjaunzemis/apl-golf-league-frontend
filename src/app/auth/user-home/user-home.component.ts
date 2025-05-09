import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth.service';
import { UserInfo } from '../../shared/user.model';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  standalone: false,
})
export class UserHomeComponent implements OnInit {
  userInfo: UserInfo;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((info) => (this.userInfo = info));
  }
}
