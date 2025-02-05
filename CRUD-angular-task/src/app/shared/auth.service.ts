import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }
  signup(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?email=${email}&password=${password}`);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); 
  }
  logout(): void {
    localStorage.removeItem('user'); 
  }
}
