import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { delayedRetry } from './error-handling/delayed-retry';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      delayedRetry(1000, 3),
      catchError((error: HttpErrorResponse) => {
        let errorMessage =
          'Uh oh... An unknown error occurred! :( Please try again later. If this error persists, contact the webmaster.';
        if (error.error.detail) {
          errorMessage = error.error.detail;
        }
        this.snackBar.open(errorMessage, undefined, {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        return throwError(error);
      })
    );
  }
}
