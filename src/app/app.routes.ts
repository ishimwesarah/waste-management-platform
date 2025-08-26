import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Public-facing components
import { HomePageComponent } from './features/public/home-page/home-page.component';
import { AboutPageComponent } from './features/public/about-page/about-page.component';
import { ContactPageComponent } from './features/public/contact-page/contact-page.component';

// Entry points for authentication
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';

export const routes: Routes = [
  // Public Routes (Accessible without login)
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'privacy', component: HomePageComponent }, // Placeholder
  { path: 'terms', component: HomePageComponent },   // Placeholder

  // Authentication Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Authenticated Routes (Protected by authGuard)
  // These routes are children of the AuthLayoutComponent implicitly via app.component.ts
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'schedule',
    loadChildren: () => import('./features/schedule/schedule.routes').then(m => m.scheduleRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'invoices',
    loadChildren: () => import('./features/invoices/invoices.routes').then(m => m.invoicesRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard] // Consider adding a separate AdminGuard here later
  },

  // Wildcard route for 404 - redirect to home if not logged in, or dashboard if logged in
  { path: '**', redirectTo: '/home' }
];