import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Post {
  id?: number,
  title: string,
  content: string,
  summary?: string,
  thumbnail: string,
  published_at?: string | Date,
  category_id: number,
  user_id: number
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  apiUrl = "http://127.0.0.1:8000/api/posts";
  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error("error to fetch Post", error);
        return throwError(() => new Error("Failed to fetching"));
      })
    );
  }

  update(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post).pipe(
      catchError(error => {
        console.error("Lỗi khi sửa bài báo", error);
        return throwError(() => new Error("Sửa không thành công"));
      })
    );
  }

  show(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error("error to fetch Post", error);
        return throwError(() => new Error("Failed to fetching"));
      })
    );
  }

  create(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      catchError(error => {
        console.error("Lỗi tạo bài báo", error);
        return throwError(() => new Error("Tạo thất bại"));
      })
    );
  }

  delete(id: number): Observable<Post> {
    return this.http.delete<Post>(`${this.apiUrl}/${id}`);
  }

}
