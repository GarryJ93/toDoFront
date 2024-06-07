import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WcsAngularModule } from 'wcs-angular';
import { TaskService } from '../service/task.service';
import { Task } from '../models/task';
import { log } from 'node:console';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, WcsAngularModule],
  providers: [TaskService],
  template: `
    <wcs-card mode="raised">
      <wcs-card-body>
        @if(!task.isEditing) {

        <wcs-checkbox
          type="checkbox"
          [checked]="task.done"
          label-alignment="center"
          (wcsChange)="onChangeState(task.id)"
          >{{ task.title | titlecase }}</wcs-checkbox
        >
        <div class="action-btn">
          <wcs-button
            (click)="onDeleteTask(task.id)"
            class="wcs-danger"
            shape="round"
            size="m"
            >Supprimer</wcs-button
          >
          <wcs-button
            (click)="task.isEditing = !task.isEditing"
            class="wcs-warning"
            shape="round"
            size="m"
            >Modifier</wcs-button
          >
        </div>

        } @else {
        <div>Modifier le nom de la tâche :</div>
        <wcs-input
          #newTitle
          type="text"
          id="input"
          placeholder="{{ task.title | titlecase }}"
        />
        <wcs-button
          type="button"
          class="wcs-primary"
          shape="round"
          (click)="onChangeTitle(task.id, newTitle.value!.toString())"
          [disabled]="!newTitle.value"
        >
          Valider
        </wcs-button>
        <wcs-button
          type="button"
          class="wcs-danger"
          shape="round"
          (click)="task.isEditing = !task.isEditing"
        >
          Annuler
        </wcs-button>
        }
      </wcs-card-body></wcs-card
    >
  `,
  styles: `
  wcs-button {
    margin: 0 0.5em;
  }

  .action-btn {
    margin-top: 2em;
  }

  #input {
    width: 50%;
    margin: 2em 0 2em 2em;
    border: none;
  }

  @media (max-width: 734px) {
    wcs-button {
    margin-bottom: 0.5em;
  }
  }
  `,
})
export class CardComponent {
  @Input() task!: Task;
  @Input() tasks!: Task[];
  updatedTasks!: Task[];
  @Output() tasksChange: EventEmitter<Task[]> = new EventEmitter();

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.tasksChange.emit(this.tasks);
  }

  onChangeState(id: number) {
    this.taskService.changeState(id).subscribe({
      next: (response) => {
        console.log(response);
        this.tasks = [...response];
        console.log(this.tasks);
        this.tasksChange.emit(this.tasks);
      },
    });
  }

  onChangeTitle(id: number, newTitle: string) {
    if (newTitle === '') {
      return;
    } else {
      this.taskService.changeTitle(id, newTitle).subscribe({
        next: (response: Task[]) => {
          console.log(response);
          this.updatedTasks = response.map((task) =>
            task.id === id
              ? { ...task, title: newTitle, isEditing: false }
              : { ...task, isEditing: false }
          );
          console.log(this.updatedTasks);
          this.task = { ...this.task, title: newTitle, isEditing: false };
          this.tasksChange.emit(this.updatedTasks);
        },
      });
    }
  }

  onDeleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        const updatedTasks = this.tasks.filter((task: Task) => task.id !== id);
        this.tasksChange.emit(updatedTasks);
      },
    });
  }
}
