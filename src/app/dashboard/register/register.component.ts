import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  gender: 'male' | 'female' = 'male';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    const newUser = {
      name: `${this.firstName} ${this.lastName}`,
      email: this.email,
      phone: this.phone,
      password: this.password,
      gender: this.gender,
      role: 'user' // Set the default role to 'user'
    };

    this.authService.register(newUser).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have successfully registered!',
          confirmButtonColor: '#ff6600'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
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
