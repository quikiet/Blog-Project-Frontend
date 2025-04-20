import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefusesService {
  apiUrl = "https://tqkdomain.io.vn/public/api/refuses";
  // apiUrl = "http://127.0.0.1:8000/api/refuses";
  constructor(private http: HttpClient) { }

  getAllRefuses(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error("error fetching refuse refuse", error);
        return throwError(() => new Error("Failed to fetch refuse refuse"));
      })
    );
  }

  create(refuse: any): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(this.apiUrl, refuse, { headers }).pipe(
      catchError(error => {
        console.error("error create refuse refuse", error);
        return throwError(() => new Error("Failed to create refuse refuse"));
      })
    )
  }

  edit(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  update(id: number, refuse: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, refuse, { headers });
  }

  delete(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
