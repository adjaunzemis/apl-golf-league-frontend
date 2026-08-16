import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthInterceptorService } from './auth-interceptor.service';
import { AuthService } from './auth.service';
import { User } from '../shared/user.model';

describe('AuthInterceptorService', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let userSubject: BehaviorSubject<User | null>;

  const futureDate = new Date(Date.now() + 3600 * 1000);
  const loggedInUser = new User(1, 'golfer1', 'g@a.com', 'Golfer One', false, false, false, false, false, 'bearer-token-999', futureDate);

  beforeEach(() => {
    userSubject = new BehaviorSubject<User | null>(null);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { user: userSubject } },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass request unmodified when user is not logged in', () => {
    userSubject.next(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should append Authorization header when user is logged in with valid token', () => {
    userSubject.next(loggedInUser);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer bearer-token-999');
    req.flush({});
  });
});
