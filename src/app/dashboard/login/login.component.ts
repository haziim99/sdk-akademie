import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  redirectTo: string | null = null;
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectTo = params['redirectTo'] || null;
    });
  }

  onSubmit(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.showAlert('warning', 'Input Required', 'Please enter both email and password.');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response: { success: boolean; token?: string; role?: string; userId?: string }) => {
        this.isLoading = false;

        if (response.success) {
          this.handleSuccessfulLogin(response.role || 'user');
        } else {
          this.showAlert('error', 'Login Failed', 'Invalid login credentials.');
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.showAlert('error', 'Login Failed', 'An error occurred. Please try again later.');
      }
    });
  }

  private handleSuccessfulLogin(role: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'You have successfully logged in!',
      confirmButtonColor: '#ff6600'
    }).then(() => {
      const redirectUrl = this.redirectTo || this.getRedirectUrl(role);
      console.log(`Redirecting to: ${redirectUrl}`);
      this.router.navigate([redirectUrl], { replaceUrl: true }).then(() => {
        console.log('Navigation successful');
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    });
  }

  private getRedirectUrl(role: string): string {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'user':
        return '/profile';
      default:
        return '/';
    }
  }

  navigateToForgetPassword(): void {
    this.router.navigate(['/forgetpassword']);
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  private showAlert(icon: any, title: string, text: string): void {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonColor: '#ff6600'
    });
  }
}
