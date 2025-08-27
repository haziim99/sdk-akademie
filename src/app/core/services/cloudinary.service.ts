import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dzmcteb1t';
  private imageUploadPreset = 'courses';
  private videoUploadPreset = 'video_upload';

  private cloudinaryImageUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  private cloudinaryVideoUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/video/upload`;
  private cloudinaryDeleteImageUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
  private cloudinaryDeleteVideoUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/video/destroy`;

  constructor(private http: HttpClient) {}

  uploadImage(fileOrFormData: File | FormData, preset: string = this.imageUploadPreset): Observable<{ secure_url: string }> {
    const formData = fileOrFormData instanceof FormData ? fileOrFormData : this.createFormData(fileOrFormData, preset);
    return this.http.post<{ secure_url: string }>(this.cloudinaryImageUrl, formData);
  }

  uploadVideo(fileOrFormData: File | FormData, preset: string = this.videoUploadPreset): Observable<any> {
    const formData = fileOrFormData instanceof FormData ? fileOrFormData : this.createFormData(fileOrFormData, preset, true);
    return this.http.post<any>(this.cloudinaryVideoUrl, formData);
  }

  deleteImage(publicId: string): Observable<any> {
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', environment.cloudinary.apiKey);
    formData.append('api_secret', environment.cloudinary.apiSecret);
    return this.http.post<any>(this.cloudinaryDeleteImageUrl, formData);
  }

  deleteVideo(publicId: string): Observable<any> {
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('resource_type', 'video');
    formData.append('api_key', environment.cloudinary.apiKey);
    formData.append('api_secret', environment.cloudinary.apiSecret);
    return this.http.post<any>(this.cloudinaryDeleteVideoUrl, formData);
  }

  private createFormData(file: File, preset: string, isVideo: boolean = false): FormData {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    if (isVideo) {
      formData.append('resource_type', 'video');
    }
    return formData;
  }
}
