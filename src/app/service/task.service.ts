import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task } from '../models/task';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskUrl: string;
  public tasksList = new BehaviorSubject<Task[]>([]);
  tasksList$ = this.tasksList.asObservable();

  constructor(private http: HttpClient) {
    this.taskUrl = 'http://localhost:8080/api/task';
  }

  public findAll(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.taskUrl)
      .pipe(tap((tasks) => this.tasksList.next(tasks)));
  }

  public changeState(id: number) {
    return this.http.patch(`${this.taskUrl}/${id}`, null, {
      responseType: 'text' as 'json',
    });
  }

  public changeTitle(id: number, newTitle: string) {
    return this.http.patch(
      `http://localhost:8080/api/title/${id}`,
      { title: newTitle },
      { responseType: 'text' as 'json' }
    );
  }

  public deleteTask(id: number) {
    return this.http.delete(`${this.taskUrl}/${id}`, {
      responseType: 'text' as 'json',
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
