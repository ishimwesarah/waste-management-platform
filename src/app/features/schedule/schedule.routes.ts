// src/app/features/schedule/schedule.routes.ts
import { Routes } from '@angular/router';
import { ScheduleViewerComponent } from './components/schedule-viewer/schedule-viewer.component';
import { ScheduleEditorComponent } from './components/schedule-editor/schedule-editor.component';

export const scheduleRoutes: Routes = [
  { path: '', component: ScheduleViewerComponent },
  { path: 'edit', component: ScheduleEditorComponent }
];