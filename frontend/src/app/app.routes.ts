import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'workspaces',
    loadComponent: () => import('./components/workspace/workspace-list.component').then(m => m.WorkspaceListComponent)
  },
  {
    path: 'workspaces/:id',
    loadComponent: () => import('./components/workspace/workspace-detail.component').then(m => m.WorkspaceDetailComponent)
  },
  {
    path: 'boards',
    loadComponent: () => import('./components/board/board-list.component').then(m => m.BoardListComponent)
  },
  {
    path: 'boards/:id',
    loadComponent: () => import('./components/board/kanban-board.component').then(m => m.KanbanBoardComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/task/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./components/task/task-detail.component').then(m => m.TaskDetailComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./components/user/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/user/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/shared/not-found.component').then(m => m.NotFoundComponent)
  }
];