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
import { MatInputModule } from '@angular/material/input';
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
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, AfterViewInit {
  // ViewChild decorators to access Material table sorting and pagination
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // Component properties
  tasks: Task[] = []; // Array to store all tasks
  dataSource = new MatTableDataSource<Task>([]); // Material table data source
  displayedColumns: string[] = ['select', 'title', 'dueDate', 'priority', 'status', 'actions']; // Table column definitions
  selectedTasks: Set<number> = new Set(); // Set to track selected tasks for bulk operations
  isLoading = false; // Loading state flag
  searchTerm = ''; // Search term for filtering tasks

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook: Called after data-bound properties are initialized
   * Loads all tasks when component initializes
   */
  ngOnInit(): void {
    this.loadAllTasks();
  }

  /**
   * Lifecycle hook: Called after the view and child views are initialized
   * Sets up sorting and pagination for the Material table
   */
  ngAfterViewInit() {
    // Configure sorting for the table
    if (this.dataSource && this.sort) {
      this.dataSource.sort = this.sort;
    }
    // Configure pagination for the table
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    // Set up custom sorting logic for different column types
    if (this.dataSource) {
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'title': 
            return item.title.toLowerCase(); // Case-insensitive string sorting
          case 'dueDate': 
            return new Date(item.dueDate).getTime(); // Date sorting by timestamp
          case 'priority': 
            // Custom priority sorting: Low=1, Medium=2, High=3
            const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
            return priorityOrder[item.priority as keyof typeof priorityOrder] || 0;
          case 'status': 
            return item.status.toLowerCase(); // Case-insensitive string sorting
          default: 
            return String(item[property as keyof Task] || '');
        }
      };
    }
  }

  /**
   * Applies filter to the table based on search input
   * Filters tasks by title in real-time as user types
   * @param event - Input event from search field
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Loads all tasks from the API and updates the table
   * Sets loading state and handles errors gracefully
   */
  loadAllTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.dataSource = new MatTableDataSource(tasks);
        // Re-apply sorting and pagination after data load
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

  /**
   * Filters and displays tasks due within the next 7 days
   * Used for quick filtering from the sort dropdown menu
   */
  loadTasksDueInNext7Days(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        // Calculate date 7 days from now
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        // Filter tasks due between today and 7 days from now
        this.tasks = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= new Date() && dueDate <= sevenDaysFromNow;
        });
        this.dataSource = new MatTableDataSource(this.tasks);
        // Re-apply sorting and pagination
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

  /**
   * Filters and displays overdue tasks (past due date and not completed)
   * Used for quick filtering from the sort dropdown menu
   */
  loadOverdueTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        // Filter tasks that are overdue and not completed
        this.tasks = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate < new Date() && task.status !== 'Completed';
        });
        this.dataSource = new MatTableDataSource(this.tasks);
        // Re-apply sorting and pagination
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

  /**
   * Sorts tasks by priority in the specified direction
   * @param direction - 'high' for High to Low, 'low' for Low to High
   */
  sortByPriority(direction: 'high' | 'low'): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        // Sort tasks by priority using custom priority order
        this.tasks = tasks.sort((a, b) => {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          
          if (direction === 'high') {
            return bPriority - aPriority; // High to Low (3,2,1)
          } else {
            return aPriority - bPriority; // Low to High (1,2,3)
          }
        });
        this.dataSource = new MatTableDataSource(this.tasks);
        // Re-apply sorting and pagination
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

  /**
   * Deletes a task after user confirmation
   * @param id - The ID of the task to delete
   */
  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadAllTasks(); // Reload tasks after deletion
      });
    }
  }

  /**
   * Returns CSS class for priority styling
   * @param priority - Priority level (High, Medium, Low)
   * @returns CSS class name for styling
   */
  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  /**
   * Returns CSS class for status styling
   * @param status - Task status (Completed, InProgress, Pending)
   * @returns CSS class name for styling
   */
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'inprogress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  }

  // ===== BULK SELECTION METHODS =====
  
  /**
   * Checks if all tasks are currently selected
   * @returns true if all tasks are selected, false otherwise
   */
  isAllSelected(): boolean {
    return this.tasks.length > 0 && this.selectedTasks.size === this.tasks.length;
  }

  /**
   * Checks if some (but not all) tasks are selected
   * Used for indeterminate state of the master checkbox
   * @returns true if some tasks are selected, false otherwise
   */
  isIndeterminate(): boolean {
    return this.selectedTasks.size > 0 && this.selectedTasks.size < this.tasks.length;
  }

  /**
   * Toggles selection of all tasks
   * If all are selected, deselects all
   * If some or none are selected, selects all
   */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selectedTasks.clear(); // Deselect all
    } else {
      // Select all tasks that have valid IDs
      this.tasks.forEach(task => {
        if (task.id !== undefined) {
          this.selectedTasks.add(task.id);
        }
      });
    }
  }

  /**
   * Toggles selection of a specific task
   * @param taskId - The ID of the task to toggle
   */
  toggleTaskSelection(taskId: number | undefined): void {
    if (taskId !== undefined) {
      if (this.selectedTasks.has(taskId)) {
        this.selectedTasks.delete(taskId); // Remove from selection
      } else {
        this.selectedTasks.add(taskId); // Add to selection
      }
    }
  }

  /**
   * Checks if a specific task is selected
   * @param taskId - The ID of the task to check
   * @returns true if the task is selected, false otherwise
   */
  isTaskSelected(taskId: number | undefined): boolean {
    return taskId !== undefined && this.selectedTasks.has(taskId);
  }

  /**
   * Returns the count of currently selected tasks
   * @returns Number of selected tasks
   */
  getSelectedTasksCount(): number {
    return this.selectedTasks.size;
  }

  // ===== BULK ACTION METHODS =====
  
  /**
   * Opens the bulk update status dialog
   * Shows a dialog for updating the status of multiple selected tasks
   */
  openBulkUpdateStatusDialog(): void {
    const selectedTaskIds = Array.from(this.selectedTasks);
    const dialogRef = this.dialog.open(BulkUpdateStatusDialogComponent, {
      width: '400px',
      data: {
        taskCount: selectedTaskIds.length,
        taskIds: selectedTaskIds
      }
    });

    // Handle dialog result
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performBulkStatusUpdate(selectedTaskIds, result.status);
      }
    });
  }

  /**
   * Performs the actual bulk status update via API call
   * @param taskIds - Array of task IDs to update
   * @param newStatus - New status to apply to all selected tasks
   */
  private performBulkStatusUpdate(taskIds: number[], newStatus: string): void {
    this.isLoading = true;
    this.taskService.bulkUpdateStatus(taskIds, newStatus).subscribe({
      next: () => {
        // Show success message
        this.snackBar.open(`Updated ${taskIds.length} tasks.`, 'Close', {
          duration: 3000
        });
        this.selectedTasks.clear(); // Clear selection
        this.loadAllTasks(); // Reload to show updated data
        this.isLoading = false;
      },
      error: (error: any) => {
        // Show error message
        this.snackBar.open('Couldn\'t update tasks. Try again.', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }
}

// ===== BULK UPDATE STATUS DIALOG COMPONENT =====

/**
 * Dialog component for bulk updating task status
 * 
 * Features:
 * - Form validation for status selection
 * - Loading state during update
 * - Error handling and display
 * - Summary of tasks being updated
 */
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
  // Component properties
  statusForm: FormGroup; // Form for status selection
  isUpdating = false; // Loading state flag
  errorMessage = ''; // Error message display

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BulkUpdateStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskCount: number; taskIds: number[] }
  ) {
    // Initialize form with required validation
    this.statusForm = this.fb.group({
      status: ['', Validators.required]
    });
  }

  /**
   * Handles cancel button click
   * Closes the dialog without performing any action
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Handles update button click
   * Validates form and closes dialog with selected status
   */
  onUpdate(): void {
    if (this.statusForm.valid) {
      this.isUpdating = true;
      this.errorMessage = '';
      
      // Simulate API call delay for better UX
      setTimeout(() => {
        this.isUpdating = false;
        this.dialogRef.close({
          status: this.statusForm.value.status
        });
      }, 1000);
    }
  }
}
