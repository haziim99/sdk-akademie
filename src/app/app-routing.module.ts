import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './layout/components/about/about.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
<<<<<<< HEAD
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Lazy loaded feature modules
=======
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

>>>>>>> optimized-architecture
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./features/courses/courses.module').then(m => m.CoursesModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/dashboard/admin-dashboard/admin-dashboard.module').then(
        m => m.AdminDashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./features/dashboard/user-dashboard/user-dashboard.module').then(
        m => m.UserDashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./features/contact/contact.module').then(m => m.ContactModule),
  },

  // Static routes
<<<<<<< HEAD
  { path: 'about', component: AboutComponent },

  { path: '**', redirectTo: 'home' }
=======
  {
    path: 'about',
    component: AboutComponent,
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: 'home',
  },
>>>>>>> optimized-architecture
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
<<<<<<< HEAD
export class AppRoutingModule { }
=======
export class AppRoutingModule {}
>>>>>>> optimized-architecture
