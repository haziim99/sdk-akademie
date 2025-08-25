import { User } from '@/app/services/models/user.model';
import { Component, Inject } from '@angular/core';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-user-edit-dialog-component',
  templateUrl: './user-edit-dialog-component.component.html',
  styleUrl: './user-edit-dialog-component.component.scss'
})
export class UserEditDialogComponentComponent {

  userForm!: FormGroup;
  roles = [
    { value: 'user', viewValue: 'User' },
    { value: 'admin', viewValue: 'Admin' }
  ];

  genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserEditDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<User>

  ) {}

  ngOnInit() {
  const userData = this.data || {};
  this.userForm = this.fb.group({
    name: [this.data?.name || '', Validators.required],
    email: [this.data?.email || '', [Validators.required, Validators.email]],
    phone: [this.data?.phone || '', Validators.required],
    address: [this.data?.address || ''],
    gender: [this.data?.gender || 'male', Validators.required],
    role: [this.data?.role || 'user', Validators.required],
    dob: [this.data?.dob || null],
    level: [this.data?.level || 'beginner'],
    profilePicture: [this.data?.profilePicture || null],
    courses: [this.data?.courses || []],
    password: [this.data?.password || '']
  });
}

  saveUser() {
    if (this.userForm.valid) {
      const cleanedData = { ...this.userForm.value };

      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === undefined) {
          cleanedData[key] = null;
        }
      });

      this.dialogRef.close(cleanedData);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
