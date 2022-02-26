import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ErrorDialogComponent } from "./error-dialog/error-dialog.component";

@NgModule({
  declarations: [
    ErrorDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ErrorDialogComponent
  ]
})
export class ErrorModule {}
