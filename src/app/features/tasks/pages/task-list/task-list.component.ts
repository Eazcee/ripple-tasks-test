import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { Task } from '../../../../models/task.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatSelectModule, 
    MatDividerModule, 
    MatCheckboxModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  tasks: Task[] = [];
  dataSource!: MatTableDataSource<Task>;
  displayedColumns: string[] = ['select', 'title', 'dueDate', 'priority', 'status', 'actions'];
  selectedTasks: Set<number> = new Set();
  isLoading = false;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllTasks();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'title': return item.title.toLowerCase();
        case 'dueDate': return new Date(item.dueDate).getTime();
        case 'priority': 
          const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          return priorityOrder[item.priority as keyof typeof priorityOrder] || 0;
        case 'status': return item.status.toLowerCase();
        default: return String(item[property as keyof Task] || '');
      }
    };
  }

  loadAllTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.dataSource = new MatTableDataSource(tasks);
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadTasksDueInNext7Days(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        this.tasks = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= new Date() && dueDate <= sevenDaysFromNow;
        });
        this.dataSource = new MatTableDataSource(this.tasks);
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadOverdueTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate < new Date() && task.status !== 'Completed';
        });
        this.dataSource = new MatTableDataSource(this.tasks);
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  sortByPriority(direction: 'high' | 'low'): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.sort((a, b) => {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          
          if (direction === 'high') {
            return bPriority - aPriority; // High to Low
          } else {
            return aPriority - bPriority; // Low to High
          }
        });
        this.dataSource = new MatTableDataSource(this.tasks);
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadAllTasks();
      });
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'inprogress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  }

  // Bulk selection methods
  isAllSelected(): boolean {
    return this.tasks.length > 0 && this.selectedTasks.size === this.tasks.length;
  }

  isIndeterminate(): boolean {
    return this.selectedTasks.size > 0 && this.selectedTasks.size < this.tasks.length;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selectedTasks.clear();
    } else {
      this.tasks.forEach(task => {
        if (task.id !== undefined) {
          this.selectedTasks.add(task.id);
        }
      });
    }
  }

  toggleTaskSelection(taskId: number | undefined): void {
    if (taskId !== undefined) {
      if (this.selectedTasks.has(taskId)) {
        this.selectedTasks.delete(taskId);
      } else {
        this.selectedTasks.add(taskId);
      }
    }
  }

  isTaskSelected(taskId: number | undefined): boolean {
    return taskId !== undefined && this.selectedTasks.has(taskId);
  }

  getSelectedTasksCount(): number {
    return this.selectedTasks.size;
  }

  // Bulk action methods
  openBulkUpdateStatusDialog(): void {
    const selectedTaskIds = Array.from(this.selectedTasks);
    const dialogRef = this.dialog.open(BulkUpdateStatusDialogComponent, {
      width: '400px',
      data: {
        taskCount: selectedTaskIds.length,
        taskIds: selectedTaskIds
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performBulkStatusUpdate(selectedTaskIds, result.status);
      }
    });
  }

  private performBulkStatusUpdate(taskIds: number[], newStatus: string): void {
    this.isLoading = true;
    this.taskService.bulkUpdateStatus(taskIds, newStatus).subscribe({
      next: () => {
        this.snackBar.open(`Updated ${taskIds.length} tasks.`, 'Close', {
          duration: 3000
        });
        this.selectedTasks.clear();
        this.loadAllTasks(); // Reload to show updated data
        this.isLoading = false;
      },
      error: (error: any) => {
        this.snackBar.open('Couldn\'t update tasks. Try again.', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }
}

// Bulk Update Status Dialog Component
@Component({
  selector: 'app-bulk-update-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Update Status</h2>
    <mat-dialog-content>
      <p class="summary-text">You're updating {{ data.taskCount }} task(s).</p>
      
      <form [formGroup]="statusForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="Pending">Pending</mat-option>
            <mat-option value="InProgress">In Progress</mat-option>
            <mat-option value="Completed">Completed</mat-option>
          </mat-select>
        </mat-form-field>
      </form>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="isUpdating">Cancel</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onUpdate()" 
        [disabled]="!statusForm.valid || isUpdating">
        <mat-spinner *ngIf="isUpdating" diameter="16" class="spinner"></mat-spinner>
        {{ isUpdating ? 'Updating...' : 'Update' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .summary-text {
      margin-bottom: 16px;
      color: #666;
      font-size: 14px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: 8px;
    }
    
    .spinner {
      margin-right: 8px;
    }
    
    mat-dialog-actions button {
      min-width: 80px;
    }
  `]
})
export class BulkUpdateStatusDialogComponent {
  statusForm: FormGroup;
  isUpdating = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BulkUpdateStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskCount: number; taskIds: number[] }
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    if (this.statusForm.valid) {
      this.isUpdating = true;
      this.errorMessage = '';
      
      // Simulate API call delay
      setTimeout(() => {
        this.isUpdating = false;
        this.dialogRef.close({
          status: this.statusForm.value.status
        });
      }, 1000);
    }
  }
}
