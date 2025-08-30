// src/app/features/reviews/reviews.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG modules if needed
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Routing
import { ReviewsRoutingModule } from './reviews-routing.module';

// Components
import { ReviewsComponent } from './components/reviews.component';

@NgModule({
  declarations: [
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    ToastModule,
    ReviewsRoutingModule
  ],
  providers: [MessageService],
  exports: [
    ReviewsComponent
  ]
})
export class ReviewsModule {}
