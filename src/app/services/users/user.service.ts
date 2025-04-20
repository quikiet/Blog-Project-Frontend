import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // apiUrl = "https://tqkdomain.io.vn/public/api/users";
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

  getPostByUserId(id: number, page: number = 1, perPage: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>(`${this.apiUrl}/${id}/posts`, { params });
  }

  //Khang

  getCurrentUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteUserConfirm(id: number, password: string): Observable<any[]> {
    return this.http.delete<any>(`${this.apiUrl}/confirm/${id}`, { body: { password: password } });
  }

}
