import { Component, OnInit } from '@angular/core';
import { AuthService } from '@/app/core/services/auth.service';
import { User } from '@/app/core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';


@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
  users: User[] = [];

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit() {
    this.fetchUsers();
  }


  fetchUsers() {
    this.authService.getAllUsers().subscribe({
      next: (users: User[]) => {
      this.users = users;
      this.cdr.detectChanges();
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
    this.authService.navigateBack();
  }

  trackByUserId(index: number, user: User): string {
  return user.id;
}

  addUser() {
  const dialogRef = this.dialog.open(UserEditDialogComponent, {
    data: {}
  });

  dialogRef.afterClosed().subscribe((result: Partial<User>) => {
    if (result) {
      this.authService.addUser(result).then(() => {
        setTimeout(() => this.fetchUsers(), 100);
      });
    }
  });
}


  editUser(userId: string) {
  const userToEdit = this.users.find(user => user.id === userId);
  const dialogRef = this.dialog.open(UserEditDialogComponent, {
    data: userToEdit
  });

  dialogRef.afterClosed().subscribe((result: Partial<User>) => {
    if (result) {
      this.authService.updateUser(userId, result).then(() => {
        console.log(`User with ID: ${userId} updated successfully`);
        this.fetchUsers();
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
        this.fetchUsers();
      }).catch(error => {
        console.error('Error deleting user:', error);
      });
    }
  }
}
