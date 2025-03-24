import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  apiUrl = "http://127.0.0.1:8000/api/authors";
  constructor(private http: HttpClient) { }

  getAllAuthors(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error("error fetching authors", error);
        return throwError(() => new Error("Failed to fetch authors"));
      })
    );
  }

  createAuthor(author: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, author, { headers }).pipe(
      catchError(error => {
        console.error("error create author");
        return throwError(() => new Error("Failed to create author"));
      })
    );
  }

  deleteAuthor(slug: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${slug}`, { headers });
  }

  showAuthor(slug: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${slug}`, { headers });
  }

  updateAuthor(slug: string, author: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${slug}`, author, { headers });
  }

}
