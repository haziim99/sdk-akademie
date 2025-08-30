// app/features/auth/auth.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthRoutingModule } from './auth-routing.module';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';

// PrimeNG
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetpasswordComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ForgetpasswordComponent
  ]
})
export class AuthModule { }
