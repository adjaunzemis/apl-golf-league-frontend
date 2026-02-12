import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';

import { Golfer, GolferAffiliation } from '../../shared/golfer.model';
import { SelectModule } from 'primeng/select';

@Component({
  templateUrl: './golfer-create.component.html',
  styleUrls: ['./golfer-create.component.css'],
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, FloatLabel, SelectModule],
})
export class GolferCreateComponent {
  newGolferFormGroup = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    affiliationControl: new FormControl(GolferAffiliation.APL_EMPLOYEE, Validators.required),
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    phoneControl: new FormControl(''),
  });

  affiliationOptions = [
    GolferAffiliation.APL_EMPLOYEE,
    GolferAffiliation.APL_RETIREE,
    GolferAffiliation.APL_FAMILY,
    GolferAffiliation.NON_APL_EMPLOYEE,
  ];

  public dialogRef: DynamicDialogRef<GolferCreateComponent> = inject(DynamicDialogRef);

  onSubmit(): void {
    if (!this.newGolferFormGroup.valid) {
      return;
    }
    let golferName: string = this.newGolferFormGroup.value.nameControl as string;
    golferName = golferName
      .split(' ')
      .map((namePart) => namePart.charAt(0).toUpperCase() + namePart.slice(1))
      .join(' ')
      .trim();

    const golferData: Golfer = {
      id: -1, // TODO: relax required 'id' value
      name: golferName,
      affiliation: this.newGolferFormGroup.value.affiliationControl as GolferAffiliation,
      email: (this.newGolferFormGroup.value.emailControl as string).trim(),
      phone: (this.newGolferFormGroup.value.phoneControl as string).trim(),
    };

    this.dialogRef.close(golferData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
