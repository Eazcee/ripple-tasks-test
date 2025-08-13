import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../../../models/task.model';
import { TaskService } from '../../../../services/task.service';

/**
 * Component for displaying detailed information about a specific task.
 * Fetches task data based on the ID from the route parameters and displays
 * all task properties in a user-friendly format with inline editing capabilities.
 */
@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  
  // The task object to display
  task: Task | null = null;
  
  // Loading state indicator
  loading = true;
  
  // Error state indicator
  error = false;
  
  // Error message to display
  errorMessage = '';
  
  // Edit mode state
  isEditMode = false;
  
  // Form for editing
  editForm: FormGroup;
  
  // Saving state
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [null, Validators.required],
      priority: ['Medium', Validators.required],
      status: ['Pending', Validators.required]
    });
  }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches the task details based on the route parameter.
   */
  ngOnInit(): void {
    this.loadTaskDetails();
  }

  /**
   * Loads the task details from the API based on the task ID from route parameters.
   * Handles loading states and error scenarios.
   */
  private loadTaskDetails(): void {
    // Get the task ID from the route parameters
    const taskId = this.route.snapshot.paramMap.get('id');
    
    if (!taskId) {
      this.handleError('No task ID provided');
      return;
    }

    // Convert string ID to number and fetch task details
    const id = parseInt(taskId, 10);
    if (isNaN(id)) {
      this.handleError('Invalid task ID');
      return;
    }

    // Reset loading and error states
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    // Fetch task details from the service
    this.taskService.getTask(id).subscribe({
      next: (task: Task) => {
        this.task = task;
        this.loading = false;
        this.populateEditForm();
      },
      error: (err: any) => {
        this.handleError('Failed to load task details');
        console.error('Error loading task:', err);
      }
    });
  }

  /**
   * Populates the edit form with current task data
   */
  private populateEditForm(): void {
    if (this.task) {
      this.editForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        dueDate: new Date(this.task.dueDate),
        priority: this.task.priority,
        status: this.task.status
      });
    }
  }

  /**
   * Handles error scenarios by setting error state and message.
   * @param message - The error message to display
   */
  private handleError(message: string): void {
    this.error = true;
    this.errorMessage = message;
    this.loading = false;
  }

  /**
   * Navigates back to the task list.
   */
  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  /**
   * Toggles edit mode on/off
   */
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.populateEditForm();
    }
  }

  /**
   * Saves the edited task
   */
  saveTask(): void {
    if (this.editForm.valid && this.task?.id) {
      this.saving = true;
      const updatedTask: Task = {
        ...this.task,
        ...this.editForm.value
      };

      this.taskService.updateTask(this.task.id, updatedTask).subscribe({
        next: (savedTask: Task) => {
          this.task = savedTask;
          this.isEditMode = false;
          this.saving = false;
          this.snackBar.open('Task updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          // Navigate back to task list after successful save
          this.router.navigate(['/tasks']);
        },
        error: (err: any) => {
          this.saving = false;
          this.handleError('Failed to update task');
          console.error('Error updating task:', err);
          this.snackBar.open('Failed to update task. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  /**
   * Cancels edit mode and reverts changes
   */
  cancelEdit(): void {
    this.isEditMode = false;
    this.populateEditForm();
  }

  /**
   * Deletes the current task after user confirmation.
   * Navigates back to task list after successful deletion.
   */
  deleteTask(): void {
    if (!this.task?.id) return;

    // Show confirmation dialog
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          // Navigate back to task list after successful deletion
          this.router.navigate(['/tasks']);
          this.snackBar.open('Task deleted successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error: (err: any) => {
          this.handleError('Failed to delete task');
          console.error('Error deleting task:', err);
          this.snackBar.open('Failed to delete task. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  /**
   * Gets the CSS class for priority styling.
   * @param priority - The priority level of the task
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
   * Gets the CSS class for status styling.
   * @param status - The status of the task
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

  /**
   * Formats a date for display.
   * @param date - The date to format
   * @returns Formatted date string
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  /**
   * Formats a date and time for display.
   * @param date - The date to format
   * @returns Formatted date and time string
   */
  formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString();
  }

  /**
   * Checks if a task is overdue (past its due date).
   * @param dueDate - The due date to check
   * @returns True if the task is overdue, false otherwise
   */
  isOverdue(dueDate: Date | string): boolean {
    return new Date(dueDate) < new Date();
  }
}
