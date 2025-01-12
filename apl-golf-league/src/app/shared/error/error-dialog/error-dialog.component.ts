import { Component, Inject } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";

@Component({
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.css"]
})
export class ErrorDialogComponent {

  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, isUnknownError: boolean }) {}

  close() {
    this.dialogRef.close();
  }

}
