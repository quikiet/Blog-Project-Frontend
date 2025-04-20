import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefuseReasonService {
  apiUrl = "https://tqkdomain.io.vn/public/api/refuse-reasons";
  // apiUrl = "http://127.0.0.1:8000/api/refuse-reasons";
  constructor(private http: HttpClient) { }


  getAllReason(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error("error fetching refuse reason", error);
        return throwError(() => new Error("Failed to fetch refuse reason"));
      })
    );
  }

  create(reason: any): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(this.apiUrl, reason, { headers }).pipe(
      catchError(error => {
        console.error("error create refuse reason", error);
        return throwError(() => new Error("Failed to create refuse reason"));
      })
    )
  }

  edit(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  update(id: number, reason: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, reason, { headers });
  }


  bulkDeleteRefuses(ids: number[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.post(`${this.apiUrl}/bulk`, { ids }, { headers });
  }

  delete(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
