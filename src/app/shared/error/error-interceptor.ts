/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { delayedRetry } from './error-handling/delayed-retry';
import { NotificationService } from 'src/app/notifications/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private notificationService = inject(NotificationService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      delayedRetry(1000, 3),
      catchError((error: HttpErrorResponse) => {
        const errorSummary = 'Error';
        let errorMessage =
          'Uh oh... An unknown error occurred! :( Please try again later. If this error persists, contact the webmaster.';
        if (error.error.detail) {
          errorMessage = error.error.detail;
        }
        this.notificationService.showError(errorSummary, errorMessage, 5000);
        return throwError(() => error);
      }),
    );
  }
}
