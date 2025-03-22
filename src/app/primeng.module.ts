import { NgModule } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';

@NgModule({
  exports: [
    SharedModule,
    ButtonModule,
    ImageModule,
    CardModule,
    DialogModule,
    MenubarModule,
    TabViewModule,
    BadgeModule,
    DrawerModule,
    SelectModule,
  ],
})
export class PrimeNGModule {}
