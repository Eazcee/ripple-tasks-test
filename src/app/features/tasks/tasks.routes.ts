import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'new',
    loadChildren: () => import('./pages/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  {
    path: ':id',
    loadChildren: () => import('./pages/task-detail/task-detail.component').then(m => m.TaskDetailComponent)
  }
]; 