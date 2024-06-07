import { Component, DoCheck, OnInit } from '@angular/core';
import { TaskService } from '../service/task.service';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './add-task.component';
import { RouterLink } from '@angular/router';
import { WcsAngularModule } from 'wcs-angular';
import { CardComponent } from './card.component';
import { BehaviorSubject, Observable } from 'rxjs';

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

    <div>
      <wcs-label class="select-name">Voir mes tâches : </wcs-label>
      <div>
        <select
          id="theselect"
          size="m"
          name="The select"
          (change)="onFilter($event)"
        >
          <option value="1">Toutes</option>
          <option value="2">En attente</option>
          <option value="3">Complétées</option>
        </select>
      </div>
    </div>
    <div class="cards">
      @for(task of tasksToDisplay$ | async; track task.id) {
      <app-card
        class="card"
        [task]="task"
        [(tasks)]="tasks"
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

  select {
    width: 50%;
  }

  .select-name {
    margin: 0.2em;
  }
  
  .cards {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap:wrap ;
    padding: 2em;
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
export class HomeComponent implements OnInit, DoCheck {
  tasks!: Task[];
  tasksToDisplay!: Task[];
  private tasksToDisplaySubject: BehaviorSubject<Task[]> = new BehaviorSubject<
    Task[]
  >([]);
  tasksToDisplay$: Observable<Task[]> =
    this.tasksToDisplaySubject.asObservable();
  currentFilter: string = '1';
  filtered: boolean = false;
  tasksDone!: Task[];
  tasksUndone!: Task[];
  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.findAll().subscribe({
      next: (response) => {
        this.tasks = response.map((task) => ({
          ...task,
          isEditing: false,
        }));
        this.taskService.sortByBoolean(this.tasks);
        this.tasksToDisplay = [...this.tasks];
        this.updateTasksToDisplay(this.tasksToDisplay);
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }

  ngDoCheck() {
    if (this.tasks) {
      const tasksDone = this.tasks.filter((task) => task.done);
      const tasksUndone = this.tasks.filter((task) => !task.done);
      if (
        this.tasksToDisplay &&
        this.tasks.length < this.tasksToDisplay.length && !this.filtered
      ) {
          this.updateTasksToDisplay(this.tasks);
          this.onSelect(this.currentFilter);
        } 
      if (
        tasksDone.length <
        this.tasksToDisplay.filter((task) => task.done).length
      ) {
        this.updateTasksToDisplay(tasksDone);
        this.onSelect(this.currentFilter);
      } else if (
        tasksUndone.length <
        this.tasksToDisplay.filter((task) => !task.done).length
      ) {
        this.updateTasksToDisplay(tasksUndone);
        this.onSelect(this.currentFilter);
      }
    }
  }

  onFilter(e: Event) {
    const target = e.target as HTMLWcsSelectOptionElement;
    this.updateTasksToDisplay(this.tasks);
    this.onSelect(target.value);
  }

  onSelect(value: string) {
    this.tasksToDisplay = [...this.tasks];
    this.currentFilter = value;
    if (value === '1') {
      this.filtered = false;
      this.taskService.sortByBoolean(this.tasksToDisplay);
    }
    if (value === '2') {
      this.filtered = true;
      this.tasksToDisplay = [...this.tasks.filter((task) => !task.done)];
    }
    if (value === '3') {
      this.filtered = true;
      this.tasksToDisplay = [...this.tasks.filter((task) => task.done)];
    }
    this.updateTasksToDisplay(this.tasksToDisplay);
  }

  private updateTasksToDisplay(tasks: Task[]) {
    this.tasksToDisplaySubject.next(tasks);
  }
}
