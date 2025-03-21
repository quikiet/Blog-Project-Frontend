import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Category {
  id?: number,
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl = "http://127.0.0.1:8000/api/categories";
  constructor(private http: HttpClient) { }

  countCategory(): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Category[]>(this.apiUrl, { headers }).pipe(
      map((category) => category.length)
    );
  }

  getAll(): Observable<Category[]> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Category[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error("error fetching category", error);
        return throwError(() => new Error("Failed to fetch category"));
      })
    );
  }

  create(category: Category): Observable<Category> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Category>(this.apiUrl, category, { headers }).pipe(
      catchError(error => {
        console.error("error create category", error);
        return throwError(() => new Error("Failed to create category"));
      })
    )
  }

  edit(id: number): Observable<Category> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Category>(`${this.apiUrl}/${id}`, { headers });
  }

  update(id: number, category: Category): Observable<Category> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { headers });
  }

  delete(id: number): Observable<Category> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<Category>(`${this.apiUrl}/${id}`, { headers });
  }

}
