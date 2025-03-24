import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UnderConstructionGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    this.router.navigate(['/under-construction']);
    return false;
  }
}
