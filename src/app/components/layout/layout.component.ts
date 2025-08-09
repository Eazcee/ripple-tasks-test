import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="toggleSidenav()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>Task Management System</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/tasks" routerLinkActive="active">
        <mat-icon>list</mat-icon>
        Tasks
      </button>
    </mat-toolbar>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class LayoutComponent {
  toggleSidenav() {
    // TODO: Implement sidenav toggle
  }
}
