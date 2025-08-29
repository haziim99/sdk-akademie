// app/core/core.module.ts
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Services & Guards
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { StorageService } from './services/storage.service';
import { AuthGuard } from './guards/auth.guard';
import { MessageService } from 'primeng/api';
import { CloudinaryService } from './services/cloudinary.service';
import { FirebaseService } from './services/firebase.service';
import { ImageUploadService } from './services/image-upload.service';
import { NotificationService } from './services/notification.service';
import { PaymentService } from './services/payment.service';
import { ProfileService } from './services/profile.service';
import { CoursesService } from '@/app/core/services/courses.service';
import { SettingsService } from '@/app/core/services/settings.service';
import { SupportService } from '@/app/core/services/support.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    UserService,
    StorageService,
    AuthGuard,
    MessageService,
    provideHttpClient(withFetch()),
    CloudinaryService,
    FirebaseService,
    ImageUploadService,
    NotificationService,
    PaymentService,
    ProfileService,
    CoursesService,
    SettingsService,
    SupportService
  ],
})
export class CoreModule {
  // Prevent re-import of the CoreModule
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
