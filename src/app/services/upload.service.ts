import { Injectable } from '@angular/core';
import { cloudinaryConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private cloudName = cloudinaryConfig.cloudName;
  private uploadPreset = cloudinaryConfig.uploadPreset;
  // apiUrl = "https://tqkdomain.io.vn/public/api";
  apiUrl = 'http://127.0.0.1:8000/api/';


  constructor(private http: HttpClient) { }
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return this.http.post(cloudinaryUrl, formData);
  }

  deleteImage(publicId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-image`, { publicId });
  }
}