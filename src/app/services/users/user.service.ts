import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // apiUrl = "https://67d78aa99d5e3a10152b1732.mockapi.io/User";
  apiUrl = "http://127.0.0.1:8000/api/users";

  constructor(private http: HttpClient) { }

  getAllUser(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  updateUser(user: any, id: number): Observable<any[]> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any[]> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }


}
