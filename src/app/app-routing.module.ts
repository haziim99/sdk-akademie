import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './courses/course-detail/course-detail.component';
import { CourseOverviewComponent } from './courses/course-overview/course-overview.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './services/guards/auth.guard';
import { LoginComponent } from './dashboard/login/login.component';
import { RegisterComponent } from './dashboard/register/register.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { ForgetpasswordComponent } from './dashboard/forgetpassword/forgetpassword.component';
import { PaymentMethodComponent } from './dashboard/payment-method/payment-method.component';
import { AdminGuard } from './services/guards/admin.guard';
import { CourseModalComponent } from './dashboard/admin-dashboard/course-modal/course-modal.component';
import { StudentManagementComponent } from './dashboard/admin-dashboard/student-management/student-management.component';
import { PaymentDetailsComponent } from './dashboard/admin-dashboard/payment-details/payment-details.component';
import { ProfileManagementComponent } from './dashboard/admin-dashboard/profile-management/profile-management.component';
import { SupportComponent } from './dashboard/admin-dashboard/support/support.component';
import { SystemSettingsComponent } from './dashboard/admin-dashboard/system-settings/system-settings.component';

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
