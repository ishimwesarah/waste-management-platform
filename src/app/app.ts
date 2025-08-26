import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { PublicLayoutComponent } from './core/layouts/public-layout/public-layout.component'; // New
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';     // New

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // RouterOutlet,
    PublicLayoutComponent, // Import new layouts
    AuthLayoutComponent
  ],
  template: `
    @if (authService.isLoggedIn()) {
      <app-auth-layout></app-auth-layout>
    } @else {
      <app-public-layout></app-public-layout>
    }
  `,
  styles: `
    :host {
      display: block; // Ensures the component takes full width/height
      height: 100%;
    }
  `
})
export class AppComponent {
  public authService = inject(AuthService);
}