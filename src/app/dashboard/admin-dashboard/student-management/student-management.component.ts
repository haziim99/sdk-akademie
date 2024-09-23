import { Component, OnInit } from '@angular/core';
import { AuthService } from '@/app/services/auth.service';
import { User } from '@/app/services/user.model';
@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
  users: User[] = []; // قائمة الطلاب

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.authService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  navigateBack() {
    // توجيه إلى لوحة التحكم
    this.authService.navigateBack();
  }

  editUser(userId: string) {
    // تنفيذ وظيفة تعديل المستخدم
    console.log(`Editing user with ID: ${userId}`);
  }

  deleteUser(userId: string) {
    // تنفيذ وظيفة حذف المستخدم
    console.log(`Deleting user with ID: ${userId}`);
  }

  addUser() {
    // تنفيذ وظيفة إضافة مستخدم جديد
    console.log('Adding new user');
  }
}
