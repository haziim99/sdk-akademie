import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
  payments = [
    {
      user: {
        name: 'Admin Admin',
        email: 'admin@gmail.com',
        phone: '01014072106'
      },
      amount: 100,
      method: 'Credit Card',
      date: new Date(),
      status: 'Completed'
    },
    {
      user: {
        name: 'User One',
        email: 'userone@example.com',
        phone: '01012345678'
      },
      amount: 50,
      method: 'PayPal',
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      status: 'Pending'
    },
    {
      user: {
        name: 'User Two',
        email: 'usertwo@example.com',
        phone: '01087654321'
      },
      amount: 150,
      method: 'Bank Transfer',
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      status: 'Failed'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // هنا يمكنك استدعاء خدمة لعرض المدفوعات الحقيقية في المستقبل
  }

  navigateBack(): void {
    this.router.navigate(['/admin-dashboard']); // تأكد من تعديل المسار حسب الحاجة
  }
}
