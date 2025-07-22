// src/app/task.ts
export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline?: string;
}
