import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskUrl: string;
  
  

  constructor(private http: HttpClient) {
    this.taskUrl = 'http://localhost:8080/api/task';
  }

  public sortByBoolean(taskArray: Task[]) : Task[] {
    taskArray = taskArray.sort(function (a, b) {
      return a.done > b.done ? 0 : a ? -1 : 0;
    });
    return taskArray
  }

  public findAll(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.taskUrl);
  }

  public changeState(id: number) : Observable<Task[]> {
    return this.http.patch<Task[]>(`${this.taskUrl}/${id}`, null, {
      responseType: 'json',
    });
  }

  public changeTitle(id: number, newTitle: string) : Observable<Task[]> {
    return this.http.patch<Task[]>(
      `http://localhost:8080/api/title/${id}`,
      { title: newTitle },
      { responseType: 'json' }
    );
  }

  public deleteTask(id: number) : Observable<Task> {
    return this.http.delete<Task>(`${this.taskUrl}/${id}`, {
      responseType: 'json',
    });
  }

  public addTask(title: string) {
    console.log(title);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { title: title };
    return this.http.post(this.taskUrl, body, {
      headers,
      responseType: 'text' as 'json',
    });
  }
}
