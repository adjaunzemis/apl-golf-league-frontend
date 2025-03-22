import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService = inject(MessageService);

  showSuccess(summary: string, detail: string, time_ms = 3000): void {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
      life: time_ms,
    });
  }

  showInfo(summary: string, detail: string, time_ms = 3000): void {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
      life: time_ms,
    });
  }

  showWarning(summary: string, detail: string, time_ms = 3000): void {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
      life: time_ms,
    });
  }

  showError(summary: string, detail: string, time_ms = 3000): void {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: time_ms,
    });
  }

  showSecondary(summary: string, detail: string, time_ms = 3000): void {
    this.messageService.add({
      severity: 'secondary',
      summary: summary,
      detail: detail,
      life: time_ms,
    });
  }

  showContrast(summary: string, detail: string, time_ms = 3000): void {
    this.messageService.add({
      severity: 'contrast',
      summary: summary,
      detail: detail,
      life: time_ms,
    });
  }
}
