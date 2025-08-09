export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'InProgress' | 'Completed';
  createdAt?: Date;
  updatedAt?: Date;
} 