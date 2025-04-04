import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Post {
  id?: number,
  title: string,
  content: string,
  summary?: string,
  thumbnail: string,
  published_at?: string | Date,
  category_id: number,
  user_id: number,
  posts_user?: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  apiUrl = "https://tqkdomain.io.vn/public/api/posts";
  // apiUrl = "http://127.0.0.1:8000/api/posts";
  constructor(private http: HttpClient) { }



  countPost(): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Post[]>(this.apiUrl, { headers }).pipe(
      map((post) => post.length)
    );
  }

  countPendingPost(): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Post[]>(`${this.apiUrl}/pending`, { headers }).pipe(
      map((post) => post.length)
    );
  }

  getAllPosts(): Observable<Post[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Post[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error("error to fetch Post", error);
        if (error.status === 401) {
          localStorage.removeItem('token_expiration');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        return throwError(() => new Error("Failed to fetching"));
      })
    );
  }

  getFeaturePost(): Observable<any> {
    return this.http.get(`${this.apiUrl}/featured`);
  }

  getSubFeatures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sub-features`);
  }

  getLatestPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/latest`);
  }

  getTrendingPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trending`);
  }

  getPendingPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  getArchivedPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/archived`);
  }

  update(slug: string, post: Post): Observable<Post> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Post>(`${this.apiUrl}/${slug}`, post, { headers }).pipe(
      catchError(error => {
        console.error("Lỗi khi sửa bài báo", error);
        return throwError(() => new Error("Sửa không thành công"));
      })
    );
  }

  show(slug: string): Observable<Post> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Post>(`${this.apiUrl}/${slug}`, { headers }).pipe(
      catchError(error => {
        console.error("error to fetch Post", error);
        return throwError(() => new Error("Failed to fetching"));
      })
    );
  }

  create(post: Post): Observable<Post> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Post>(this.apiUrl, post, { headers }).pipe(
      catchError(error => {
        console.error("Lỗi tạo bài báo", error);
        return throwError(() => new Error("Tạo thất bại"));
      })
    );
  }

  delete(slug: string): Observable<Post> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<Post>(`${this.apiUrl}/${slug}`, { headers });
  }


}
