import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsettingService {
  // private apiUrl = 'http://127.0.0.1:8000/api/website-settings';
  private apiUrl = "https://tqkdomain.io.vn/public/api/website-settings";

  constructor(private http: HttpClient) { }

  getSettings() {
    const res = this.http.get(this.apiUrl);
    console.log('res', res);
    return res;
  }

  updateSettings(settings: any) {
    return this.http.put(this.apiUrl, settings);
  }
}
