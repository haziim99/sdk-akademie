import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // تأكد من تضمين HttpClientModule
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './courses/course-detail/course-detail.component';
import { StoreModule } from '@ngrx/store';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ReviewsComponent } from './home/reviews/reviews.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './dashboard/login/login.component';
import { AuthGuard } from './services/guards/auth.guard';
import { AuthService } from './services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from './dashboard/register/register.component';
import { ForgetpasswordComponent } from './dashboard/forgetpassword/forgetpassword.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PaymentMethodComponent } from './dashboard/payment-method/payment-method.component';
import { StorageService } from './services/storage.service';
import { CourseOverviewComponent } from './courses/course-overview/course-overview.component';
import { UserService } from './services/user.service';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { StatsOverviewComponent } from './dashboard/admin-dashboard/stats-overview/stats-overview.component';
import { StudentManagementComponent } from './dashboard/admin-dashboard/student-management/student-management.component';
import { StudentDetailsComponent } from './dashboard/admin-dashboard/student-management/student-details/student-details.component';
import { StudentProgressComponent } from './dashboard/admin-dashboard/student-management/student-progress/student-progress.component';
import { ReviewsManagementComponent } from './dashboard/admin-dashboard/student-management/reviews-management/reviews-management.component';
import { PaymentDetailsComponent } from './dashboard/admin-dashboard/payment-details/payment-details.component';
import { ProfileManagementComponent } from './dashboard/admin-dashboard/profile-management/profile-management.component';
import { SystemSettingsComponent } from './dashboard/admin-dashboard/system-settings/system-settings.component';
import { LanguageSettingsComponent } from './dashboard/admin-dashboard/system-settings/language-settings/language-settings.component';
import { PaymentSettingsComponent } from './dashboard/admin-dashboard/system-settings/payment-settings/payment-settings.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { CourseModalComponent } from './dashboard/admin-dashboard/course-modal/course-modal.component';

// Firebase Imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

// Cloudinary Imports
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { SupportComponent } from './dashboard/admin-dashboard/support/support.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CoursesComponent,
    CourseDetailsComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ReviewsComponent,
    AdminDashboardComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ForgetpasswordComponent,
    PaymentMethodComponent,
    CourseOverviewComponent,
    DashboardComponent,
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
    ScrollToTopComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    StorageService,
    UserService,
    MessageService,
    provideHttpClient(withFetch()),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
