import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
