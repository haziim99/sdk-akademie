// app/features/courses/courses.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './components/course-detail/course-detail.component';
import { CourseOverviewComponent } from './components/course-overview/course-overview.component';

// Routing
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseDetailsComponent,
    CourseOverviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CoursesComponent,
    CourseDetailsComponent,
    CourseOverviewComponent
  ]
})
export class CoursesModule { }
