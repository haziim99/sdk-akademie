// src/app/features/dashboard/user-dashboard/user-dashboard.module.ts
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

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Components
import { ProfileComponent } from './components/profile/profile.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';

// Guards / Services if needed
// import { AuthGuard } from '@/app/core/guards/auth.guard';

@NgModule({
  declarations: [
    ProfileComponent,
    PaymentMethodComponent,
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
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
  ],
  providers: [MessageService],
  exports: [
    ProfileComponent,
    PaymentMethodComponent
  ]
})
export class UserDashboardModule {}
