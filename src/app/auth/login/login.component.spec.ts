import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/notifications/notification.service';
import { User } from 'src/app/shared/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: {
    user: BehaviorSubject<User | null>;
    login: jasmine.Spy;
    logout: jasmine.Spy;
  };
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let userSubject: BehaviorSubject<User | null>;

  const futureDate = new Date(Date.now() + 3600 * 1000);
  const mockUser = new User(
    1,
    'golfer1',
    'g@a.com',
    'Tiger Woods',
    false,
    false,
    false,
    false,
    false,
    'tkn',
    futureDate,
  );

  beforeEach(async () => {
    userSubject = new BehaviorSubject<User | null>(null);

    authServiceMock = {
      user: userSubject,
      login: jasmine.createSpy('login').and.callFake(() => {
        userSubject.next(mockUser);
        return of({}).pipe(delay(0));
      }),
      logout: jasmine.createSpy('logout'),
    };

    notificationServiceMock = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
    })
      .overrideComponent(LoginComponent, {
        set: {
          providers: [
            { provide: AuthService, useValue: authServiceMock },
            { provide: NotificationService, useValue: notificationServiceMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with invalid form', () => {
    expect(component.loginFormGroup.valid).toBeFalse();
  });

  it('should not call login when form is invalid', () => {
    component.onLogin();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call login, show notification, and reset form when submitted with valid credentials', fakeAsync(() => {
    component.loginFormGroup.controls.usernameControl.setValue('golfer1');
    component.loginFormGroup.controls.passwordControl.setValue('password123');
    expect(component.loginFormGroup.valid).toBeTrue();

    component.onLogin();
    tick();

    expect(authServiceMock.login).toHaveBeenCalledWith('golfer1', 'password123');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith(
      'Login Successful',
      "Successfully logged in as user 'golfer1'!",
      5000,
    );
    expect(component.loginFormGroup.controls.usernameControl.value).toBeNull();
  }));

  it('should return n/a when user is logged out', () => {
    expect(component.isLoggedIn()).toBeFalse();
    expect(component.getLoggedInUsername()).toBe('n/a');
    expect(component.getLoggedInName()).toBe('n/a');
  });

  it('should return user info when user is logged in', () => {
    userSubject.next(mockUser);
    expect(component.isLoggedIn()).toBeTrue();
    expect(component.getLoggedInUsername()).toBe('golfer1');
    expect(component.getLoggedInName()).toBe('Tiger Woods');
  });

  it('should trigger logout on AuthService when onLogout is called', () => {
    component.onLogout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
