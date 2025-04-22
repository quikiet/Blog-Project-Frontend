import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // apiURL = "https://tqkdomain.io.vn/public/api";
  apiURL = "http://127.0.0.1:8000/api";
  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, data);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiURL}/logout`, {}, { headers });
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiURL}/me`, { headers });
  }

  getRole() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    const token_expiration = localStorage.getItem('token_expiration');

    if (!token || !token_expiration) {
      return false;
    }

    const now = new Date().getTime();
    if (now > parseInt(token_expiration)) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
      return false;
    }
    return true;
  }


}
