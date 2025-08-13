import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule, MatDividerModule, RouterModule],
    templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['title', 'dueDate', 'priority', 'status', 'actions'];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadAllTasks();
  }

  loadAllTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  loadTasksDueInNext7Days(): void {
    // Since we don't have a direct endpoint for this, we'll filter from all tasks
    this.taskService.getTasks().subscribe(tasks => {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      
      this.tasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= new Date() && dueDate <= sevenDaysFromNow;
      });
    });
  }

  loadOverdueTasks(): void {
    // Since we don't have a direct endpoint for this, we'll filter from all tasks
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate < new Date() && task.status !== 'Completed';
      });
    });
  }

  sortByPriority(direction: 'high' | 'low'): void {
    this.taskService.getTasks().subscribe(tasks => {
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
}
