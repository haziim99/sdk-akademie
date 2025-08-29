import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';

// UI Modules
import { MaterialModule } from '../material/material.module';
import { PrimeNgModule } from '../material/primeng.module';

@NgModule({
  declarations: [
    ScrollToTopComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PrimeNgModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PrimeNgModule,
    ScrollToTopComponent,
    TranslateModule
  ]
})
export class SharedModule {}
