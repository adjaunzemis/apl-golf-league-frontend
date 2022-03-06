import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usernameControl = new FormControl("", Validators.required);
  passwordControl = new FormControl("", [Validators.required, Validators.minLength(6)]);

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.authService.login(this.usernameControl.value, this.passwordControl.value).subscribe(
      result => {
        console.log("Login successful!");
        console.log(result);
        this.usernameControl.reset();
        this.passwordControl.reset();
      },
      errorMessage => {
        console.error("Login failed!");
        console.log(errorMessage); // TODO: handle error
      });
  }

}
