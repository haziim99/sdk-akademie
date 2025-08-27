import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './features/courses/components/courses/courses.component';
import { CourseDetailsComponent } from './features/courses/components/course-detail/course-detail.component';
import { CourseOverviewComponent } from './features/courses/components/course-overview/course-overview.component';
import { HomeComponent } from './features/home/components/home.component';
import { AboutComponent } from './layout/components/about/about.component';
import { ContactComponent } from './features/contact/component/contact.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/components/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ProfileComponent } from './features/dashboard/user-dashboard/components/profile/profile.component';
import { ForgetpasswordComponent } from './features/auth/components/forgetpassword/forgetpassword.component';
import { PaymentMethodComponent } from './features/dashboard/user-dashboard/components/payment-method/payment-method.component';
import { AdminGuard } from './core/guards/admin.guard';
import { CourseModalComponent } from './features/dashboard/admin-dashboard/components/course-modal/course-modal.component';
import { StudentManagementComponent } from './features/dashboard/admin-dashboard/components/student-management/student-management/student-management.component';
import { PaymentDetailsComponent } from './features/dashboard/admin-dashboard/components/payment-managment/payment-details/payment-details.component';
import { ProfileManagementComponent } from './features/dashboard/admin-dashboard/components/profile-management/profile-management.component';
import { SupportComponent } from './features/dashboard/admin-dashboard/components/support/support.component';
import { SystemSettingsComponent } from './features/dashboard/admin-dashboard/components/system-settings/system-settings/system-settings.component';
import { ManageVideosComponent } from './features/dashboard/admin-dashboard/components/manage-videos/manage-videos/manage-videos.component';
import { VideoPlayerComponent } from './features/dashboard/admin-dashboard/components/manage-videos/video-player/video-player.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: CoursesComponent },
  { path: 'course-details/:id', component: CourseDetailsComponent },
  { path: 'course-overview/:id', component: CourseOverviewComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'payment-method', component: PaymentMethodComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'forgetpassword', component: ForgetpasswordComponent },
  { path: 'course-modal', component: CourseModalComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'manage-videos/:id', component: ManageVideosComponent, canActivate: [AuthGuard] },
  { path: 'video-player', component: VideoPlayerComponent },
  { path: 'student-management', component: StudentManagementComponent, canActivate: [AuthGuard, AdminGuard] }, // مسار إدارة الطلاب
  { path: 'payments-details', component: PaymentDetailsComponent, canActivate: [AuthGuard] },
  { path: 'profile-management', component: ProfileManagementComponent, canActivate: [AuthGuard] },
  { path: 'support', component: SupportComponent, canActivate: [AuthGuard] },
  { path: 'system-settings', component: SystemSettingsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
