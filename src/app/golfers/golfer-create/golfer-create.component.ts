import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Golfer, GolferAffiliation } from '../../shared/golfer.model';
import { AngularMaterialModule } from 'src/app/angular-material.module';

@Component({
  templateUrl: './golfer-create.component.html',
  styleUrls: ['./golfer-create.component.css'],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule],
})
export class GolferCreateComponent {
  nameControl: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25),
    Validators.pattern("^[a-zA-Z' ]*$"),
  ]);
  affiliationControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  emailControl: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.email,
  ]);
  phoneControl: UntypedFormControl = new UntypedFormControl('', []);

  affiliationOptions = [
    GolferAffiliation.APL_EMPLOYEE,
    GolferAffiliation.APL_RETIREE,
    GolferAffiliation.APL_FAMILY,
    GolferAffiliation.NON_APL_EMPLOYEE,
  ];

  constructor(public dialogRef: DynamicDialogRef<GolferCreateComponent>) {}

  onSubmit(): void {
    let golferName: string = this.nameControl.value;
    golferName = golferName
      .split(' ')
      .map((namePart) => namePart.charAt(0).toUpperCase() + namePart.slice(1))
      .join(' ')
      .trim();

    const golferData: Golfer = {
      id: -1, // TODO: relax required 'id' value
      name: golferName,
      affiliation: this.affiliationControl.value as GolferAffiliation,
      email: this.emailControl.value.trim(),
      phone: this.phoneControl.value.trim(),
    };

    this.dialogRef.close(golferData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
