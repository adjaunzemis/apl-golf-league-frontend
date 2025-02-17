import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';

@NgModule({
  exports: [
    ButtonModule,
    ImageModule,
    CardModule
  ]
})
export class PrimeNGModule {}
