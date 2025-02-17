import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  exports: [ButtonModule, ImageModule, CardModule, DialogModule],
})
export class PrimeNGModule {}
