import { Component } from '@angular/core';
import { TaskService } from '../service/task.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WcsAngularModule } from 'wcs-angular';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, WcsAngularModule, RouterLink],
  providers: [TaskService],
  template: `
  <wcs-button class="wcs-light back" [routerLink]="('/home')">Retour</wcs-button>
    <h2>Veuillez saisir une tâche</h2>
    <wcs-input id="input" #input type="text" required="true" placeholder="Votre nouvelle tâche"></wcs-input>
    <wcs-button
      class="wcs-primary"
      shape="round"
      (click)="onAddNewTask(input.value!.toString())"
      [disabled]="!input.value"
      >Valider</wcs-button
    >
  `,
  styles: `
  #input {
    width: 50%;
    margin: 2em 0 2em 2em;
    border: none;
  }

  h2 {
    margin: 2em;
  }

  .back {
    margin-top: 1em;
  }
  `,
})
export class AddTaskComponent {
  constructor(private taskService: TaskService, private router: Router) {}

  onAddNewTask(newTask: string) {
    if (newTask === "") {
      return
    }
    else {
    this.taskService.addTask(newTask).subscribe({
      next: (response) => {
        console.log(response);
      },
    });
      this.router.navigate(['/home']);
    }
  }
}
