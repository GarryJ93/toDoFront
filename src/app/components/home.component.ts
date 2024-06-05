import { Component, OnInit } from '@angular/core';
import { TaskService } from '../service/task.service';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './add-task.component';
import { RouterLink } from '@angular/router';
import { WcsAngularModule } from 'wcs-angular';
import { CardComponent } from './card.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AddTaskComponent,
    RouterLink,
    WcsAngularModule,
    CardComponent,
  ],
  providers: [TaskService],
  template: `<div>
      Voici vos tâches : @for(task of tasks; track task.id) {
      <app-card
        [task]="task"
        [(tasks)]="tasks"
      ></app-card>
      } @empty {
      <div>Vous n'avez actuellement aucune tâche de prévue.</div>
      }
    </div>
    <wcs-button class="wcs-success" shape="round" routerLink="/add">Ajouter une tâche</wcs-button> `,
  styles: `
  li {
    list-style: none;
  }`,
})
export class HomeComponent implements OnInit {
  tasks!: Task[];
  constructor(private taskService: TaskService) {
    this.taskService.tasksList$.subscribe({
      next: (response) => {
        this.tasks = [...response];
        this.tasks = this.tasks.map((task) => ({
          ...task,
          isEditing: false,
        }));
      },
    });
  }

  ngOnInit() {
    this.taskService.findAll().subscribe({
      next: (response) => {
        this.taskService.tasksList.next([...response]);
      },
    });
  }

  onTasksChange(updatedTasks: Task[]) {
    this.tasks = updatedTasks;
  }
}

 

  

