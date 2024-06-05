import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WcsAngularModule } from 'wcs-angular';
import { TaskService } from '../service/task.service';
import { Task } from '../models/task';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, WcsAngularModule],
  providers: [TaskService],
  template: `<wcs-card mode="raised">
    <wcs-card-body>
      @if(!task.isEditing) {

      <wcs-checkbox
        type="checkbox"
        [checked]="task.done"
        label-alignment="center"
        (wcsChange)="onChangeState(task.id)"
        >{{ task.title }}</wcs-checkbox
      >

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

      } @else {
      <input #newTitle type="text" placeholder="{{ task.title }}" />
      <wcs-button type="button" class="wcs-success" shape="round" (click)="onChangeTitle(task.id, newTitle.value)">
        Valider
      </wcs-button>
      }
    </wcs-card-body></wcs-card
  > `,
  styles: ``,
})
export class CardComponent {
  @Input() task!: Task;
  @Input() tasks!: Task[];
  @Output() tasksChange: EventEmitter<Task[]> = new EventEmitter();

  constructor(private taskService: TaskService) {}
  onChangeState(id: number) {
    this.taskService.changeState(id).subscribe({
      next: (response) => {
        console.log(response);
      },
    });
  }

  onChangeTitle(id: number, newTitle: string) {
    if (newTitle === '') {
      return
    }
    else {
    this.taskService.changeTitle(id, newTitle).subscribe({
      next: (response) => {
        console.log(response);
        const updatedTasks = this.tasks.map((task) =>
          task.id === id ? { ...task, title: newTitle, isEditing: false } : task
        );
        this.tasksChange.emit(updatedTasks);
      },
    });}
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
