import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  // apiURL = "https://tqkdomain.io.vn/public/api/register";
  apiURL = "http://127.0.0.1:8000/api/register";
  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    return this.http.post(this.apiURL, data);
  }


}
