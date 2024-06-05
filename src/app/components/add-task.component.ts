import { Component } from '@angular/core';
import { TaskService } from '../service/task.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { Router } from '@angular/router';
import { WcsAngularModule } from 'wcs-angular';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, WcsAngularModule],
  providers: [TaskService],
  template: `
    <input #input type="text">
    <button (click)="onAddNewTask(input.value)">Valider</button>
  `,
  styles: ``
})
export class AddTaskComponent {

  constructor(private taskService: TaskService, private router: Router) { }
  
  onAddNewTask(newTask: string) {
    this.taskService.addTask(newTask).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/home']);
      }
    });
}
}
