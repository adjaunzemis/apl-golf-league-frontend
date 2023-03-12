import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { GolferCreateComponent } from '../golfers/golfer-create/golfer-create.component';
import { GolfersService } from '../golfers/golfers.service';
import { ErrorDialogComponent } from '../shared/error/error-dialog/error-dialog.component';
import { Golfer, GolferAffiliation } from '../shared/golfer.model';
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

  golferNameOptions: string[] = [];
  private golfersSub: Subscription;

  constructor(private authService: AuthService, private golfersService: GolfersService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;
      }
    });

    this.golfersSub = this.golfersService.getAllGolfersUpdateListener()
      .subscribe(result => {
        const golferOptions = result.sort((a: Golfer, b: Golfer) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this.golferNameOptions = result.map(golfer => golfer.name);
      });

    this.golfersService.getAllGolfers();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.golfersSub.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
    this.currentUser = null;
  }

  // TODO: Consolidate `onAddNewGolfer()` usage from header, signups
  onAddNewGolfer(): void {
    const dialogRef = this.dialog.open(GolferCreateComponent, {
      width: '300px',
      data: {
        name: '',
        affiliation: GolferAffiliation.APL_EMPLOYEE,
        email: '',
        phone: ''
      }
    });

    dialogRef.afterClosed().subscribe(golferData => {
      if (golferData !== null && golferData !== undefined) {
        const golferNameOptionsLowercase = this.golferNameOptions.map((name) => name.toLowerCase());
        if (golferNameOptionsLowercase.includes(golferData.name.toLowerCase())) {
          this.dialog.open(ErrorDialogComponent, {
            data: { title: "New Golfer Error", message: `Golfer with name '${golferData.name}' already exists!` }
          });
          return;
        }

        this.golfersService.createGolfer(golferData.name, golferData.affiliation, golferData.email !== '' ? golferData.email : null, golferData.phone !== '' ? golferData.phone : null).subscribe(result => {
          console.log(`[SignupComponent] Successfully added golfer: ${result.name}`);
          this.golfersService.getAllGolfers(); // refresh golfer name options
        });
      }
    });
  }

}
