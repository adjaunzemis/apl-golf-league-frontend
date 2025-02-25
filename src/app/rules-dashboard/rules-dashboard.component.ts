import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-rules-dashboard',
  templateUrl: './rules-dashboard.component.html',
  styleUrl: './rules-dashboard.component.css',
  imports: [CommonModule, RouterModule, AccordionModule, CardModule, TabsModule],
})
export class RulesDashboardComponent {}
