// app/features/courses/courses.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './components/course-detail/course-detail.component';
import { CourseOverviewComponent } from './components/course-overview/course-overview.component';

// Routing
import { CoursesRoutingModule } from './courses-routing.module';

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
    CoursesRoutingModule
  ],
  exports: [
    CoursesComponent,
    CourseDetailsComponent,
    CourseOverviewComponent
  ],
  providers: [
  ]
})
export class CoursesModule { }
