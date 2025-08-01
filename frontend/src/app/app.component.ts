import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <button 
          mat-icon-button 
          (click)="toggleSidenav()"
          aria-label="Toggle navigation">
          <mat-icon>menu</mat-icon>
        </button>
        
        <span class="app-title">{{ title }}</span>
        
        <span class="spacer"></span>
        
        <!-- User menu -->
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>

        <!-- Health status -->
        <div class="health-status" [class]="healthStatus">
          <mat-icon>{{ healthStatus === 'healthy' ? 'check_circle' : 'error' }}</mat-icon>
        </div>
      </mat-toolbar>

      <mat-sidenav-container class="app-sidenav-container">
        <mat-sidenav 
          #sidenav 
          mode="side" 
          opened="true" 
          class="app-sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            
            <a mat-list-item routerLink="/workspaces" routerLinkActive="active">
              <mat-icon matListItemIcon>work</mat-icon>
              <span matListItemTitle>Workspaces</span>
            </a>
            
            <a mat-list-item routerLink="/boards" routerLinkActive="active">
              <mat-icon matListItemIcon>view_kanban</mat-icon>
              <span matListItemTitle>Boards</span>
            </a>
            
            <a mat-list-item routerLink="/tasks" routerLinkActive="active">
              <mat-icon matListItemIcon>task</mat-icon>
              <span matListItemTitle>Tasks</span>
            </a>
            
            <a mat-list-item routerLink="/users" routerLinkActive="active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Users</span>
            </a>
            
            <mat-divider></mat-divider>
            
            <a mat-list-item routerLink="/settings" routerLinkActive="active">
              <mat-icon matListItemIcon>settings</mat-icon>
              <span matListItemTitle>Settings</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="app-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .app-title {
      font-weight: 600;
      margin-left: 8px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .health-status {
      margin-left: 16px;
      display: flex;
      align-items: center;
    }

    .health-status.healthy mat-icon {
      color: #4caf50;
    }

    .health-status.unhealthy mat-icon {
      color: #f44336;
    }

    .app-sidenav-container {
      flex: 1;
    }

    .app-sidenav {
      width: 250px;
      border-right: 1px solid #e0e0e0;
    }

    .app-content {
      background-color: #fafafa;
    }

    .content-wrapper {
      padding: 20px;
      min-height: calc(100vh - 64px);
    }

    .active {
      background-color: rgba(63, 81, 181, 0.1) !important;
      color: #3f51b5 !important;
    }

    @media (max-width: 768px) {
      .app-sidenav {
        width: 280px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'EMS - Enterprise Management System';
  healthStatus: 'healthy' | 'unhealthy' = 'unhealthy';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.checkHealth();
    // Check health every 30 seconds
    setInterval(() => this.checkHealth(), 30000);
  }

  toggleSidenav(): void {
    // Implementation for mobile sidebar toggle
  }

  logout(): void {
    // Implementation for logout
    console.log('Logout clicked');
  }

  private checkHealth(): void {
    this.apiService.healthCheck().subscribe({
      next: (response) => {
        this.healthStatus = response.status === 'UP' ? 'healthy' : 'unhealthy';
      },
      error: (error) => {
        this.healthStatus = 'unhealthy';
        console.error('Health check failed:', error);
      }
    });
  }
}