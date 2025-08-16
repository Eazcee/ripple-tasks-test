import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-header" [ngClass]="data.type">
        <mat-icon *ngIf="data.type === 'warning'">warning</mat-icon>
        <mat-icon *ngIf="data.type === 'danger'">delete</mat-icon>
        <mat-icon *ngIf="data.type === 'info'">info</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button 
          mat-raised-button 
          [color]="data.type === 'danger' ? 'warn' : 'primary'"
          (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
           styles: [`
      .confirmation-dialog {
        min-width: 450px;
        max-width: 600px;
        width: 100%;
        padding: 24px;
        box-sizing: border-box;
      }
      
      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }
      
      .dialog-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
        flex: 1;
        word-wrap: break-word;
      }
      
      .dialog-header.warning mat-icon {
        color: #ff9800;
        flex-shrink: 0;
      }
      
      .dialog-header.danger mat-icon {
        color: #f44336;
        flex-shrink: 0;
      }
      
      .dialog-header.info mat-icon {
        color: #2196f3;
        flex-shrink: 0;
      }
      
      mat-dialog-content {
        margin-bottom: 24px;
      }
      
      mat-dialog-content p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.6;
        color: #333;
        word-wrap: break-word;
      }
      
      mat-dialog-actions {
        gap: 12px;
        padding-top: 8px;
        flex-wrap: wrap;
      }
      
      mat-dialog-actions button {
        min-width: 80px;
      }
      
      @media (max-width: 768px) {
        .confirmation-dialog {
          min-width: 320px;
          max-width: 90vw;
          padding: 20px;
        }
        
        .dialog-header h2 {
          font-size: 1.1rem;
        }
        
        mat-dialog-content p {
          font-size: 0.9rem;
        }
        
        mat-dialog-actions {
          gap: 8px;
          justify-content: flex-end;
        }
        
        mat-dialog-actions button {
          min-width: 70px;
        }
      }
      
      @media (max-width: 480px) {
        .confirmation-dialog {
          min-width: 280px;
          max-width: 95vw;
          padding: 16px;
        }
        
        .dialog-header {
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .dialog-header h2 {
          font-size: 1rem;
        }
        
        mat-dialog-content {
          margin-bottom: 20px;
        }
        
        mat-dialog-content p {
          font-size: 0.875rem;
        }
        
        mat-dialog-actions {
          gap: 6px;
        }
        
        mat-dialog-actions button {
          min-width: 60px;
          font-size: 0.875rem;
        }
      }
    `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 