import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Post } from '../posts/post.service';

export interface Category {
  id?: number,
  name: string;
  categories_posts_count?: number;
  slug: string;
}

export interface CategoryWithPosts extends Category {
  // !!! QUAN TRỌNG: Tên thuộc tính này PHẢI KHỚP với tên quan hệ trong Model Category.php
  categories_posts: Post[]; // Hoặc 'posts: Post[];'
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // apiUrl = "https://tqkdomain.io.vn/public/api/categories";
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

  // getPostsByCategory(slug: string): Observable<Category[]> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.get<Category[]>(`${this.apiUrl}/${slug}`, { headers }).pipe(
  //     catchError(error => {
  //       console.error("error get posts by category", error);
  //       return throwError(() => new Error("Failed to get posts by category"));
  //     })
  //   )
  // }
  getPostsByCategory(slug: string): Observable<CategoryWithPosts> { // Sửa từ Category[] thành CategoryWithPosts
    // Không cần token cho API này theo định nghĩa route của bạn
    // const token = localStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Kiểu dữ liệu mong đợi từ http.get cũng nên là CategoryWithPosts
    return this.http.get<CategoryWithPosts>(`${this.apiUrl}/${slug}` /*, { headers } */).pipe(
      catchError(error => {
        console.error("error get posts by category slug", slug, error);
        // Trả về lỗi để component xử lý (ví dụ: 404)
        return throwError(() => error); // Ném lại lỗi gốc
      })
    )
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
