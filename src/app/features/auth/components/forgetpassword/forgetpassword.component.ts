import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent {
  email: string = '';

  constructor(private router: Router) { }

  onSubmit(): void {
    // هنا يتم تنفيذ منطق إعادة تعيين كلمة المرور
    Swal.fire({
      icon: 'success',
      title: 'Reset Link Sent',
      text: 'A password reset link has been sent to your email address.',
      confirmButtonColor: '#ff6600'
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
