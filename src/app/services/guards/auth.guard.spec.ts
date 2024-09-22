import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // إنشاء الماكهات (mocks) لـ AuthService و Router
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if the user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    // تمرير المعلمات الوهمية
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should redirect to login if the user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    // تمرير المعلمات الوهمية
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
