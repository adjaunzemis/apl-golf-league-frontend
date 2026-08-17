import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from '../shared/user.model';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: { user: BehaviorSubject<User | null> };
  let routerMock: jasmine.SpyObj<Router>;

  const futureDate = new Date(Date.now() + 3600 * 1000);
  const standardUser = new User(
    1,
    'golfer1',
    'g@a.com',
    'Standard User',
    false,
    false,
    false,
    false,
    false,
    'token-123',
    futureDate,
  );
  const adminUser = new User(
    2,
    'admin1',
    'a@a.com',
    'Admin User',
    false,
    true,
    true,
    true,
    true,
    'token-admin',
    futureDate,
  );

  beforeEach(() => {
    authServiceMock = {
      user: new BehaviorSubject<User | null>(null),
    };
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerMock.createUrlTree.and.callFake(
      (commands: string[]) => ({ url: commands.join('/') }) as unknown as UrlTree,
    );

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should create an instance', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect unauthenticated users to /auth/login', (done) => {
    authServiceMock.user.next(null);
    const dummyRoute = { data: {} } as ActivatedRouteSnapshot;

    const result = guard.canActivate(dummyRoute) as Observable<boolean | UrlTree>;
    result.subscribe((val) => {
      expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
      expect(val).toEqual({ url: '/auth/login' } as unknown as UrlTree);
      done();
    });
  });

  it('should allow authenticated non-admin user on non-admin route', (done) => {
    authServiceMock.user.next(standardUser);
    const dummyRoute = { data: {} } as ActivatedRouteSnapshot;

    const result = guard.canActivate(dummyRoute) as Observable<boolean | UrlTree>;
    result.subscribe((val) => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should redirect non-admin user accessing adminOnly route to root /', (done) => {
    authServiceMock.user.next(standardUser);
    const adminRoute = { data: { adminOnly: true } } as unknown as ActivatedRouteSnapshot;

    const result = guard.canActivate(adminRoute) as Observable<boolean | UrlTree>;
    result.subscribe((val) => {
      expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
      expect(val).toEqual({ url: '/' } as unknown as UrlTree);
      done();
    });
  });

  it('should allow admin user on adminOnly route', (done) => {
    authServiceMock.user.next(adminUser);
    const adminRoute = { data: { adminOnly: true } } as unknown as ActivatedRouteSnapshot;

    const result = guard.canActivate(adminRoute) as Observable<boolean | UrlTree>;
    result.subscribe((val) => {
      expect(val).toBeTrue();
      done();
    });
  });
});
