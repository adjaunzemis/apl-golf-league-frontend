import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer';

@NgModule({
  exports: [
    ButtonModule,
    ImageModule,
    CardModule,
    DialogModule,
    MenubarModule,
    BadgeModule,
    DrawerModule,
  ],
})
export class PrimeNGModule {}
