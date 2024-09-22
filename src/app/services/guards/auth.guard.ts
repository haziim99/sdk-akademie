import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      // If the user is logged in, allow access to the route
      return true;
    } else {
      // If the user is not logged in, redirect to the login page
      this.router.navigate(['/login']); // Redirect to login page
      return false;
    }
  }
}
