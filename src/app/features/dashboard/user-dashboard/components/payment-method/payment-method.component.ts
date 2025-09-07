import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { PaymentService } from '../../../../../core/services/payment.service';
import { UserService } from '../../../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  standalone: false
})
export class PaymentMethodComponent implements OnInit {
  redirectTo: string | null = null;
  showConfirmation: boolean = false;
  selectedPaymentMethod: string = '';
  courseId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectTo = params['redirectTo'] || null;
      this.courseId = params['courseId'] || null;
      console.log('Course ID:', this.courseId);
    });

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { redirectTo: this.router.url }
      });
    }
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    this.showConfirmation = true;
  }

  confirmPayment(): void {
    if (!this.selectedPaymentMethod.trim()) {
      Swal.fire({
        title: 'No Payment Method Selected',
        text: 'Please select a payment method before confirming.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!this.courseId) {
      Swal.fire({
        title: 'Course Not Found',
        text: 'Course information is missing. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      Swal.fire({
        title: 'User Information Missing',
        text: 'Unable to retrieve user information. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const paymentData = {
      courseId: this.courseId,
      userId: currentUser.id,
      paymentMethod: this.selectedPaymentMethod,
      timestamp: new Date().toISOString()
    };

    this.paymentService.processPayment(this.selectedPaymentMethod, paymentData).subscribe({
      next: (response) => {
        if (response.success) {
          this.userService.buyCourse(paymentData.userId, paymentData.courseId).subscribe({
            next: (result) => {
              if (result.success) {
                Swal.fire({
                  title: 'Payment Successful',
                  text: `You have successfully purchased the course using ${this.selectedPaymentMethod}. Redirecting to your dashboard...`,
                  icon: 'success',
                  timer: 3000,
                  timerProgressBar: true,
                  didClose: () => {
                    this.router.navigate(['/user/profile'], {
                      queryParams: { refresh: new Date().getTime() }
                    });
                  }
                });
              } else {
                Swal.fire({
                  title: 'Update Failed',
                  text: 'Payment successful, but failed to update your courses list. Please contact support.',
                  icon: 'warning',
                  confirmButtonText: 'OK'
                });
              }
            },
            error: (error) => {
              console.error('Error updating user courses:', error);
              Swal.fire({
                title: 'Update Failed',
                text: 'Payment successful, but failed to update your courses list. Please contact support.',
                icon: 'warning',
                confirmButtonText: 'OK'
              });
            }
          });
        } else {
          Swal.fire({
            title: 'Payment Failed',
            text: response.message || 'Payment failed. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (error) => {
        console.error('Error processing payment:', error);
        Swal.fire({
          title: 'Payment Error',
          text: 'An error occurred while processing your payment. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });

    this.showConfirmation = false;
  }

  cancelPayment(): void {
    this.showConfirmation = false;
    this.selectedPaymentMethod = '';
  }
}
