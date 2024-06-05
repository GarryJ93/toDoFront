import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AddTaskComponent } from './components/add-task.component';
import { WcsAngularModule } from 'wcs-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, HttpClientModule, AddTaskComponent, WcsAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'taskFront';
}
