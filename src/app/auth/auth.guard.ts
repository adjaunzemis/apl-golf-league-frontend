import { Injectable, inject } from '@angular/core';
import { Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (!isAuth) {
          return this.router.createUrlTree(['/auth/login']);
        }

        if (route.data && route.data['adminOnly'] && !user.is_admin) {
          return this.router.createUrlTree(['/']);
        }

        return true;
      }),
    );
  }
}
