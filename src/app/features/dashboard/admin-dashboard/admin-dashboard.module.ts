// features/dashboard/admin-dashboard/admin-dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { StatsOverviewComponent } from './components/stats-overview/stats-overview.component';
import { StudentManagementComponent } from './components/student-management/student-management/student-management.component';
import { StudentDetailsComponent } from './components/student-management/student-details/student-details.component';
import { StudentProgressComponent } from './components/student-management/student-progress/student-progress.component';
import { ReviewsManagementComponent } from './components/student-management/reviews-management/reviews-management.component';
import { PaymentDetailsComponent } from './components/payment-managment/payment-details/payment-details.component';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';
import { SystemSettingsComponent } from './components/system-settings/system-settings/system-settings.component';
import { LanguageSettingsComponent } from './components/system-settings/language-settings/language-settings.component';
import { PaymentSettingsComponent } from './components/system-settings/payment-settings/payment-settings.component';
import { CourseModalComponent } from './components/course-modal/course-modal.component';
import { SupportComponent } from './components/support/support.component';
import { ManageVideosComponent } from './components/manage-videos/manage-videos/manage-videos.component';
import { VideoPlayerComponent } from './components/manage-videos/video-player/video-player.component';
import { UserEditDialogComponent } from './components/student-management/user-edit-dialog/user-edit-dialog.component';
import { UserEditDialogComponentComponent } from './components/student-management/user-edit-dialog-component/user-edit-dialog-component.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    StatsOverviewComponent,
    StudentManagementComponent,
    StudentDetailsComponent,
    StudentProgressComponent,
    ReviewsManagementComponent,
    PaymentDetailsComponent,
    ProfileManagementComponent,
    SystemSettingsComponent,
    LanguageSettingsComponent,
    PaymentSettingsComponent,
    CourseModalComponent,
    SupportComponent,
    ManageVideosComponent,
    VideoPlayerComponent,
    UserEditDialogComponent,
    UserEditDialogComponentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
  ],
  providers: [MessageService],
  exports: [
    AdminDashboardComponent,
    StatsOverviewComponent,
    CourseModalComponent,
    SupportComponent,
    ProfileManagementComponent,
    SystemSettingsComponent,
    PaymentDetailsComponent
  ]
})
export class AdminDashboardModule {}

