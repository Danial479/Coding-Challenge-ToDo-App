import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Task } from './task';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];

  // 🟩 NEU: Filtervariablen – außen definieren!!
  searchText: string = '';
  statusFilter: string = '';
  priorityFilter: string = '';

  newTask: Partial<Task> = {
    title: '',
    description: '',
    priority: 'mittel',
    status: 'offen',
    deadline: ''
  };

  editTaskId: number | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  addNewTask(): void {
  if (!this.newTask.title || this.newTask.title.trim() === '') {
    alert('Titel darf nicht leer sein!');
    return;
  }

    this.taskService.addTask(this.newTask).subscribe((createdTask) => {
      this.tasks.push(createdTask);
      this.newTask = {
        title: '',
        description: '',
        priority: 'mittel',
        status: 'offen',
        deadline: ''
      };
    });
  }

  deleteTask(id: number): void {
  this.taskService.deleteTask(id).subscribe({
    next: () => {
      this.tasks = this.tasks.filter(task => task.id !== id);
    },
    error: () => {
      alert('Fehler: Verbindung zum Server fehlgeschlagen!');
    }
  });
}

  editTask(task: Task): void {
    this.editTaskId = task.id;
  }

  cancelEdit(): void {
    this.editTaskId = null;
  }

  saveTask(task: Task): void {
    this.taskService.updateTask(task).subscribe(() => {
      this.editTaskId = null;
    });
  }

  toggleStatus(task: Task): void {
    const newStatus = task.status === 'open' ? 'done' : 'open';
    const updatedTask: Task = { ...task, status: newStatus };

    this.taskService.updateTask(updatedTask).subscribe((res) => {
      task.status = res.status;
    });
  }

  
  get filteredTasks(): Task[] {
  const filtered = this.tasks.filter(task => {
    const matchesSearch =
      (!this.searchText ||
        task.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchText.toLowerCase()));
    const matchesStatus =
      !this.statusFilter || task.status === this.statusFilter;
    const matchesPriority =
      !this.priorityFilter || task.priority === this.priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  
  return filtered.sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return a.deadline.localeCompare(b.deadline);
  });
}
confirmDelete(id: number) {
  if (window.confirm('Wirklich löschen?')) {
    this.deleteTask(id);
  }
}
}

