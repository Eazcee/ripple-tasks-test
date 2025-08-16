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

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

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
  @ViewChild('bulkUpdateStatusDialog') bulkUpdateStatusDialog!: any;
  
  // Component properties
  tasks: Task[] = []; // Array to store all tasks
  dataSource = new MatTableDataSource<Task>([]); // Material table data source
  displayedColumns: string[] = ['select', 'title', 'dueDate', 'priority', 'status', 'actions']; // Table column definitions
  selectedTasks: Set<number> = new Set(); // Set to track selected tasks for bulk operations
  isLoading = false; // Loading state flag
  searchTerm = ''; // Search term for filtering tasks
  
  // Bulk update dialog properties
  bulkStatusForm: FormGroup;
  isBulkUpdating = false;
  bulkDialogError = '';
  bulkDialogData: { taskCount: number; taskIds: number[] } = { taskCount: 0, taskIds: [] };
  bulkDialogRef: MatDialogRef<any> | null = null;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.bulkStatusForm = this.fb.group({
      status: ['', Validators.required]
    });
  }

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
   * Works for both desktop table and mobile card views
   * @param event - Input event from search field
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.searchTerm;
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
   * Gets filtered tasks for mobile view based on search term
   * @returns Filtered array of tasks
   */
  get filteredTasks(): Task[] {
    if (!this.searchTerm) {
      return this.tasks;
    }
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Deletes a task after user confirmation
   * @param id - The ID of the task to delete
   */
  deleteTask(id: number): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            this.loadAllTasks(); // Reload tasks after deletion
            this.snackBar.open('Task deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            this.snackBar.open('Failed to delete task. Please try again.', 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
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
    this.bulkDialogData = {
      taskCount: selectedTaskIds.length,
      taskIds: selectedTaskIds
    };
    
    // Reset form and error state
    this.bulkStatusForm.reset();
    this.bulkDialogError = '';
    this.isBulkUpdating = false;
    
    // Open dialog using template
    this.bulkDialogRef = this.dialog.open(this.bulkUpdateStatusDialog, {
      width: '400px',
      disableClose: true
    });
  }

  /**
   * Cancels the bulk update operation
   */
  cancelBulkUpdate(): void {
    if (this.bulkDialogRef) {
      this.bulkDialogRef.close();
    }
  }

  /**
   * Confirms the bulk update operation
   */
  confirmBulkUpdate(): void {
    if (this.bulkStatusForm.valid) {
      this.isBulkUpdating = true;
      this.bulkDialogError = '';
      
      const newStatus = this.bulkStatusForm.value.status;
      const selectedTaskIds = this.bulkDialogData.taskIds;
      
      // Perform the bulk update
      this.performBulkStatusUpdate(selectedTaskIds, newStatus);
      
      // Close dialog after successful update
      if (this.bulkDialogRef) {
        this.bulkDialogRef.close();
      }
    }
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


