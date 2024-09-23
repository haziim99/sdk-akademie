import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showSuccess(message: string) {
    // استخدم مكتبة مثل Toastr لإظهار الرسائل
    alert(message); // هذه مجرد مثال بسيط
  }

  showError(message: string) {
    // استخدم مكتبة مثل Toastr لإظهار الرسائل
    alert(message); // هذه مجرد مثال بسيط
  }
}
