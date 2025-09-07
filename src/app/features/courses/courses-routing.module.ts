// src/app/features/courses/courses-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './components/course-detail/course-detail.component';
import { CourseOverviewComponent } from './components/course-overview/course-overview.component';
import { AdminDashboardModule } from '../dashboard/admin-dashboard/admin-dashboard.module';

const routes: Routes = [
  { path: '', component: CoursesComponent },
  { path: 'course-details/:id', component: CourseDetailsComponent },
  { path: 'course-overview/:id', component: CourseOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }



