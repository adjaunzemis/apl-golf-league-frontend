import { NgModule } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MenubarModule } from 'primeng/menubar';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  exports: [
    SharedModule,
    ButtonModule,
    ImageModule,
    CardModule,
    DialogModule,
    DynamicDialogModule,
    MenubarModule,
    TabsModule,
    BadgeModule,
    DrawerModule,
    SelectModule,
    TagModule,
    DatePickerModule,
    ProgressSpinnerModule,
  ],
})
export class PrimeNGModule {}
