import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    templateUrl: "./error-dialog.component.html",
    styleUrls: ["./error-dialog.component.css"],
    standalone: false
})
export class ErrorDialogComponent {

  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, isUnknownError: boolean }) {}

  close() {
    this.dialogRef.close();
  }

}
