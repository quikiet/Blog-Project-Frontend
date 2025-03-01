import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Post {
  id?: number,
  title: string,
  content: string,
  summary?: string,
  thumbnail: string,
  published_at?: Date,
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

  create(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      catchError(error => {
        console.error("error create Post", error);
        return throwError(() => new Error("Failure Create"));
      })
    );
  }

  update(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}\${id}`, post);
  }

  delete(id: number): Observable<Post> {
    return this.http.delete<Post>(`${this.apiUrl}\${id}`);
  }

}
