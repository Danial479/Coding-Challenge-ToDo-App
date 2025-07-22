import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks');
  }

  addTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>('/api/tasks', task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`/api/tasks/${id}`);
  }
  updateTask(task: Task): Observable<Task> {
  return this.http.put<Task>(`/api/tasks/${task.id}`, task);
}

} 