import { inject, Injectable } from '@angular/core';
import { CanActivateChild, Router, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceGuard implements CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivateChild(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        if (!environment.maintenance || (user != null && user.is_admin)) {
          return true;
        }
        return this.router.createUrlTree(['/maintenance']);
      }),
    );
  }
}
