import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: MessageService, useValue: messageServiceMock }],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delegate showSuccess to MessageService with severity success', () => {
    service.showSuccess('Success Header', 'Detailed success message', 5000);
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success Header',
      detail: 'Detailed success message',
      life: 5000,
    });
  });

  it('should delegate showInfo to MessageService with severity info', () => {
    service.showInfo('Info Header', 'Detailed info message');
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Info Header',
      detail: 'Detailed info message',
      life: 3000,
    });
  });

  it('should delegate showWarning to MessageService with severity warn', () => {
    service.showWarning('Warning Header', 'Detailed warning message');
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning Header',
      detail: 'Detailed warning message',
      life: 3000,
    });
  });

  it('should delegate showError to MessageService with severity error', () => {
    service.showError('Error Header', 'Detailed error message');
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error Header',
      detail: 'Detailed error message',
      life: 3000,
    });
  });
});
