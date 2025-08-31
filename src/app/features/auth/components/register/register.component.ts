import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  address: string = '';
  phone: string = '';
  password: string = '';
  gender: 'male' | 'female' = 'male';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onSubmit(): void {
    const newUser = {
        name: `${this.firstName} ${this.lastName}`,
        email: this.email,
        address: this.address,
        phone: this.phone,
        password: this.password,
        gender: this.gender,
        level: undefined // Specify level if needed
    };

    console.log('Attempting to register user:', newUser); // إضافة نقطة تسجيل دخول

    this.authService.register(newUser).subscribe({
        next: (response) => {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'You have successfully registered!',
                    confirmButtonColor: '#ff6600'
                }).then(() => {
                    this.router.navigate(['/auth/login']);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'There was an error during registration. Please try again.',
                    confirmButtonColor: '#ff6600'
                });
            }
        },
        error: (error) => {
            console.error('Registration error:', error); // إضافة نقطة تسجيل دخول
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'There was an error during registration. Please try again.',
                confirmButtonColor: '#ff6600'
            });
        }
    });
}

}
