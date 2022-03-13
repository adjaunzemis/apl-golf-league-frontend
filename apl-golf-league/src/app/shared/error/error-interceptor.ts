import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { delayedRetry } from "./error-handling/delayed-retry";
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      delayedRetry(1000, 3),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "Uh oh... An unknown error occurred! :(";
        if (error.error.detail) {
          errorMessage = error.error.detail;
        }
        this.dialog.open(ErrorDialogComponent, {
          data: { title: "Error", message: errorMessage, isUnknownError: true }
        });
        return throwError(error);
      })
    );
  }
}
