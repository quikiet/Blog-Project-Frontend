import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginByGoogleServiceService {
  // apiURL = "https://tqkdomain.io.vn/public/api";
  apiURL = 'http://127.0.0.1:8000';
  constructor(private http: HttpClient) { }
  getGoogleRedirectUrl(): string {
    return `${this.apiURL}/auth/google/redirect`;
  }
}
