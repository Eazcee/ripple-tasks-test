import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterModule],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="'navigation'"
          [mode]="isMobile ? 'over' : 'side'"
          [opened]="sidenavOpened">
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/tasks" routerLinkActive="active" (click)="onNavigationClick()">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Home</span>
          </a>
          <a mat-list-item href="http://localhost:5113/swagger" target="_blank">
            <mat-icon matListItemIcon>api</mat-icon>
            <span matListItemTitle>API Documentation</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Task Management System</span>
          <span class="spacer"></span>
          <button mat-button routerLink="/tasks" routerLinkActive="active">
            <mat-icon>home</mat-icon>
            Home
          </button>
        </mat-toolbar>

        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    
    .sidenav {
      width: 250px;
    }
    
    .sidenav .mat-toolbar {
      background: inherit;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .active {
      background-color: rgba(255, 255, 255, 0.15);
      border-left: 4px solid #1976d2;
      font-weight: 500;
    }
    
    .active mat-icon {
      color: #1976d2;
    }
    
    /* Mobile responsive styles */
    @media (max-width: 768px) {
      .sidenav {
        width: 280px;
      }
      
      .container {
        padding: 12px;
      }
    }
    
    @media (max-width: 480px) {
      .sidenav {
        width: 260px;
      }
      
      .container {
        padding: 8px;
      }
    }
  `]
})
export class LayoutComponent {
  sidenavOpened = false;
  isMobile = false;

  constructor(private router: Router) {
    this.checkScreenSize();
    // Only add event listener in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  private checkScreenSize() {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
    } else {
      // Default to desktop for SSR
      this.isMobile = false;
    }
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  /**
   * Handles navigation clicks in the sidenav
   * Closes the sidenav after navigation for better UX
   * If already on the target route, just closes the sidenav
   */
  onNavigationClick() {
    // Always close sidenav on mobile for better UX
    if (this.isMobile) {
      this.sidenavOpened = false;
    } else {
      // On desktop, check if we're already on the tasks page
      if (this.router.url === '/tasks') {
        // Already on home page, just close the sidenav
        this.sidenavOpened = false;
      } else {
        // Navigate and close sidenav after a short delay
        setTimeout(() => {
          this.sidenavOpened = false;
        }, 150);
      }
    }
  }
}
