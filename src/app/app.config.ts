// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { environment } from '../environments/environment'; // Import environment
import { ApiService } from './core/services/api.service';
import { MockApiService } from './core/services/mock-api.service'; // Import mock service

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    // Conditionally provide the real or mock API service
    {
      provide: ApiService, // When ApiService is injected...
      useClass: environment.useMockApi ? MockApiService : ApiService // ...use MockApiService if useMockApi is true, otherwise use real ApiService
    }
  ]
};