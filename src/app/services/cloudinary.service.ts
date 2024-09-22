import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dzmcteb1t';
  private uploadPreset = 'courses';
  private cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
  private cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`; // URL for deleting images

  constructor(private http: HttpClient) {}

  // Upload image (removing unnecessary parameters)
  uploadImage(formData: FormData) {
    return this.http.post<{ secure_url: string }>(this.cloudinaryUploadUrl, formData);
  }

  // Upload video
  uploadVideo(formData: FormData) {
    return this.http.post<{ secure_url: string }>(this.cloudinaryUploadUrl, formData);
  }

  // Delete image by public_id
  deleteImage(publicId: string) {
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', 'YOUR_API_KEY'); // Replace with your Cloudinary API key
    formData.append('upload_preset', this.uploadPreset); // Use the uploadPreset if necessary

    return this.http.post<any>(this.cloudinaryDeleteUrl, formData);
  }
}
