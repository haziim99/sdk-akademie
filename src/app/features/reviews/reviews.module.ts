// src/app/features/reviews/reviews.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG modules if needed
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Components
import { ReviewsComponent } from './components/reviews.component';

@NgModule({
  declarations: [
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastModule
  ],
  providers: [MessageService],
  exports: [
    ReviewsComponent
  ]
})
export class ReviewsModule {}
