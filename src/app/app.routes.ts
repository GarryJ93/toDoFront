import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { AddTaskComponent } from './components/add-task.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'add', component: AddTaskComponent },
  
];
