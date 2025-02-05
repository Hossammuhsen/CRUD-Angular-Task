import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http : HttpClient) { }

getTasks(userId:string):Observable<any[]>{
  return this.http.get<any[]>(`${this.apiUrl}/tasks?userId=${userId}`)
}
addTask(task: { userId: string; title: string; description: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/tasks`, task);
}
updateTask(taskId: string, updatedTask: { title: string; description: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/tasks/${taskId}`, updatedTask);
}
deleteTask(taskId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/tasks/${taskId}`);
}
}
 