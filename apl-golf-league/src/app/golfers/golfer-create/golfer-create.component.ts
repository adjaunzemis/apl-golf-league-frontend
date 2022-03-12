import { Component, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GolferAffiliation } from "src/app/shared/golfer.model";

@Component({
  templateUrl: './golfer-create.component.html'
})
export class GolferCreateComponent {

  nameControl: FormControl = new FormControl(this.data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]);
  affiliationControl: FormControl = new FormControl(this.data.affiliation, [Validators.required]);
  emailControl: FormControl = new FormControl(this.data.email, [Validators.required, Validators.email]);
  phoneControl: FormControl = new FormControl(this.data.phone, []);

  affiliationOptions = [
    GolferAffiliation.APL_EMPLOYEE,
    GolferAffiliation.APL_RETIREE,
    GolferAffiliation.APL_FAMILY,
    GolferAffiliation.NON_APL_EMPLOYEE
  ];

  constructor(public dialogRef: MatDialogRef<GolferCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: { name: string, affiliation: GolferAffiliation, email: string, phone: string }) { }

  onSubmit(): void {
    const golferData = {
      name: this.nameControl.value,
      affilation: (this.affiliationControl.value as GolferAffiliation),
      email: this.emailControl.value,
      phone: this.phoneControl.value
    };

    this.dialogRef.close(golferData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
