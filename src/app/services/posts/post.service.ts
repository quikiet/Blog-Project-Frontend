import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Post {
  id?: number,
  title: string,

  slug?: string, // slug rất quan trọng để tạo link

  status?: string;

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
  authors?: any; // Hoặc định nghĩa interface Author cụ thể
  category?: any;
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

  countPostByStatus(status: string): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/count_post_by_category/${status}`, { headers });
  }

  countPendingPost(): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Post[]>(`${this.apiUrl}/pending`, { headers }).pipe(
      map((post) => post.length)
    );
  }

  getPostByMonth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-month`);
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

  getScheduledPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scheduled`);
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

  recordView(postId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/view`, {});
  }

  getPostView(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}/view`);
  }

  getTotalView(): Observable<any> {
    return this.http.get(`${this.apiUrl}/total-view`);
  }

  search(keyword: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  searchPosts(keyword: string): Observable<Post[]> { // Đặt kiểu trả về là Post[]
    // Backend dùng query param tên là 'keyword'
    const params = new HttpParams().set('keyword', keyword);
    // API endpoint là /api/posts/search
    return this.http.get<Post[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(error => {
        console.error("Lỗi khi tìm kiếm bài viết:", error);
        // Trả về một observable lỗi để component có thể bắt
        return throwError(() => new Error("Tìm kiếm thất bại. Vui lòng thử lại."));
      })
    );
  }

  searchByDate(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);

    return this.http.get<any[]>(`${this.apiUrl}/search-by-date`, { params });
  }



}
