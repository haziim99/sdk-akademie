import { Component, OnInit } from '@angular/core';
import { AuthService } from '@/app/services/auth.service';
import { User } from '@/app/services/user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component'; // تأكد من المسار الصحيح


@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
  users: User[] = []; // قائمة الطلاب

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.authService.getAllUsers().subscribe({
      next: (users: User[]) => {
        console.log('Fetched users:', users); // تحقق من البيانات المستلمة
        this.users = users;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        console.log('Fetching users completed');
      }
    });
  }

  navigateBack() {
    // توجيه إلى لوحة التحكم
    this.authService.navigateBack();
  }

  editUser(userId: string) {
    const userToEdit = this.users.find(user => user.id === userId);
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: userToEdit // تمرير بيانات المستخدم إلى الحوار
    });

    dialogRef.afterClosed().subscribe((result: Partial<User>) => {
      if (result) {
        this.authService.updateUser(userId, result).then(() => {
          console.log(`User with ID: ${userId} updated successfully`);
          this.fetchUsers(); // إعادة تحميل البيانات
        }).catch(error => {
          console.error('Error updating user:', error);
        });
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(userId).then(() => {
        console.log(`User with ID: ${userId} deleted successfully`);
        this.fetchUsers(); // إعادة تحميل البيانات
      }).catch(error => {
        console.error('Error deleting user:', error);
      });
    }
  }

  addUser() {
    // تنفيذ وظيفة إضافة مستخدم جديد
    console.log('Adding new user');
  }
}
