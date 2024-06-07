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
    <h2>Voici vos tâches :</h2>
    <wcs-button class="wcs-primary btn-add" shape="round" [routerLink]="'/add'"
      >Ajouter une tâche</wcs-button
    >
    <div style="min-height: 200px">
      <label>Voir mes tâches</label>
      <select
        id="theselect"
        size="m"
        value="1"
        name="The select"
        (change)="onFilter($event)"
      >
        <option value="1" chip-background-color="var(--wcs-pink)">
          Toutes
        </option>
        <option
          value="2"
          chip-background-color="var(--wcs-yellow)"
          chip-color="var(--wcs-black)"
        >
          En attente
        </option>
        <option value="3" chip-background-color="var(--wcs-red)">
          Complétées
        </option>
      </select>
    </div>
    <div class="cards">
      @for(task of tasksToDisplay; track task) {
      <app-card
        class="card"
        [task]="task"
        [(tasks)]="tasksUpdated"
        draggable="true"
      ></app-card>
      } @empty {
      <div>Vous n'avez actuellement aucune tâche de prévue.</div>
      }
    </div>
  </div> `,
  styles: `
  li {
    list-style: none;
  }

  h2 {
    margin-top: 1em;
  }

  .btn-add {
    margin: 1em;
  }
  
  .cards {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap:wrap ;
    padding: 2em;
    margin-top: -10em;
  }

  .card {
    width: 45%;
    margin: 1em;
    
  }

  @media (max-width: 734px) {

    .cards {
    flex-direction: column;
  }

  .card {
    width: 100%;
    margin: 1em 0;
  }
  }
  `,
})
export class HomeComponent implements OnInit {
  tasks!: Task[];
  tasksToDisplay!: Task[];
  tasksUpdated!: Task[];
  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.findAll().subscribe({
      next: (response) => {
        
        this.tasks = response.map((task) => ({
          ...task,
          isEditing: false,
        }));

        
        this.tasksToDisplay = [...this.tasks];

       
        this.taskService.sortByBoolean(this.tasksToDisplay);
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }

  ngDoCheck() {
    if (this.tasksUpdated) {
      this.taskService.sortByBoolean(this.tasksUpdated!);
      this.tasks = [...this.tasksUpdated];
    }
  }

  onFilter(e: Event) {
    const target = e.target as HTMLSelectElement;
    console.log(target.value);
    if (this.tasksUpdated) {
      this.tasksToDisplay = [...this.tasksUpdated];
      this.onSelect(target.value);
    }
    if (!this.tasksUpdated) {
      this.tasksToDisplay = [...this.tasks];
      this.onSelect(target.value);
    }
      
  }
  
  onSelect(value: string) {
     if (value == '1') {
       this.taskService.sortByBoolean(this.tasksToDisplay);
     }
     if (value == '2') {
       this.tasksToDisplay = [
         ...this.tasks.filter((task) => task.done === false),
       ];
     }
     if (value == '3') {
       this.tasksToDisplay = [
         ...this.tasks.filter((task) => task.done === true),
       ];
       
    }
    console.log(this.tasksToDisplay);
    return this.tasksToDisplay;
  }
  }


 

  

