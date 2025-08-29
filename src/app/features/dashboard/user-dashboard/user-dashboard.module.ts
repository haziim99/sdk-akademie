import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@/app/shared/shared.module';
import { MessageService } from 'primeng/api';

// Routing
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';

// Components
import { ProfileComponent } from './components/profile/profile.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';

@NgModule({
  declarations: [
    ProfileComponent,
    PaymentMethodComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UserDashboardRoutingModule
  ],
  providers: [MessageService],
  exports: [
    ProfileComponent,
    PaymentMethodComponent
  ]
})
export class UserDashboardModule {}
