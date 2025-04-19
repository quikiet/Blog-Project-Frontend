import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostLikeService {
  apiUrl = "https://tqkdomain.io.vn/public/api/post_likes";
  // apiUrl = "http://127.0.0.1:8000/api/post_likes";
  constructor(private http: HttpClient) { }

  likePost(postId: number, userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, { post_id: postId, user_id: userId }, { headers });
  }

  unlikePost(postId: number, userId: number, likeID: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/{likeID}`, { body: { postId: postId, userId: userId } });
  }

  getAllLikes(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
