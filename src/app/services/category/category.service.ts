import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Category {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl = "http://127.0.0.1:8000/api/categories";
  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error("error fetching category", error);
        return throwError(() => new Error("Failed to fetch category"));
      })
    );
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(error => {
        console.error("error create category", error);
        return throwError(() => new Error("Failed to create category"));
      })
    )
  }

  edit(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  update(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.apiUrl}/${id}`);
  }

}
