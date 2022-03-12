import { Component, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Golfer, GolferAffiliation } from "../../shared/golfer.model";

@Component({
  templateUrl: './golfer-create.component.html'
})
export class GolferCreateComponent {

  nameControl: FormControl = new FormControl(this.data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("^[a-zA-Z' ]*$")]);
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
    let golferName: string = this.nameControl.value;
    golferName = golferName.split(' ').map(namePart => (namePart.charAt(0).toUpperCase() + namePart.slice(1))).join(' ').trim();

    const golferData: Golfer = {
      id: -1, // TODO: relax required 'id' value
      name: golferName,
      affiliation: (this.affiliationControl.value as GolferAffiliation),
      email: this.emailControl.value.trim(),
      phone: this.phoneControl.value.trim()
    };

    this.dialogRef.close(golferData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
