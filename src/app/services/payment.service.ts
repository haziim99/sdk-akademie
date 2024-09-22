import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private firestore: AngularFirestore // تأكد من تمرير AngularFirestore بشكل صحيح
  ) {}

  // قراءة تفاصيل الكورسات من Firestore
  getCourseDetails(courseId: string): Observable<Course | null> {
    return this.firestore.collection<Course>('courses').doc(courseId).valueChanges().pipe(
      map(course => course || null), // تحويل undefined إلى null
      catchError(error => {
        console.error('Error fetching course details:', error);
        return of(null); // في حالة حدوث خطأ، يتم إرجاع null
      })
    );
  }

  // محاكاة عملية الدفع
  processPayment(method: string, paymentData: any): Observable<any> {
    return this.getCourseDetails(paymentData.courseId).pipe(
      switchMap(course => {
        if (!course) {
          return of({ success: false, message: 'Course not found' });
        }

        // تأكد من أن الطريقة المستخدمة في الدفع صحيحة
        const validMethods = ['paypal', 'credit-card', 'bank-transfer'];
        const success = validMethods.includes(method);

        return of({ success, course });
      }),
      catchError(() => of({ success: false, message: 'Payment failed' }))
    );
  }

}
