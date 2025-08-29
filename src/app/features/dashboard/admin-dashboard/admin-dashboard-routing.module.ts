// src/app/features/dashboard/admin-dashboard/admin-dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { StudentManagementComponent } from './components/student-management/student-management/student-management.component';
import { PaymentDetailsComponent } from './components/payment-managment/payment-details/payment-details.component';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';
import { SystemSettingsComponent } from './components/system-settings/system-settings/system-settings.component';
import { SupportComponent } from './components/support/support.component';
import { ManageVideosComponent } from './components/manage-videos/manage-videos/manage-videos.component';
import { VideoPlayerComponent } from './components/manage-videos/video-player/video-player.component';
import { CourseModalComponent } from './components/course-modal/course-modal.component';
import { AuthGuard } from '@/app/core/guards/auth.guard';
import { AdminGuard } from '@/app/core/guards/admin.guard';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'student-management', component: StudentManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'payments-details', component: PaymentDetailsComponent, canActivate: [AuthGuard] },
  { path: 'profile-management', component: ProfileManagementComponent, canActivate: [AuthGuard] },
  { path: 'system-settings', component: SystemSettingsComponent, canActivate: [AuthGuard] },
  { path: 'support', component: SupportComponent, canActivate: [AuthGuard] },
  { path: 'manage-videos/:id', component: ManageVideosComponent, canActivate: [AuthGuard] },
  { path: 'video-player', component: VideoPlayerComponent },
  { path: 'course-modal', component: CourseModalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
