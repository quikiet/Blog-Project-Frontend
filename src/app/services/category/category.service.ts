import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Category {
  id?: number,
  name: string;
  slug: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl = "https://tqkdomain.io.vn/public/api/categories";
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

  edit(slug: string): Observable<Category> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Category>(`${this.apiUrl}/${slug}`, { headers });
  }

  update(slug: string, category: Category): Observable<Category> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Category>(`${this.apiUrl}/${slug}`, category, { headers });
  }

  delete(slug: string): Observable<Category> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<Category>(`${this.apiUrl}/${slug}`, { headers });
  }

}
