import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';

const PRIME_NG_MODULES = [
  InputTextModule,
  PasswordModule,
  ButtonModule,
  CheckboxModule,
  ToastModule
];

@NgModule({
  exports: PRIME_NG_MODULES
})
export class PrimeNgModule {}
