import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dzmcteb1t';
  private uploadPreset = 'courses';
  private videoUploadPreset = 'video_upload'; // إعداد البريست للفيديوهات
  private cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
  private cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`; // URL for deleting images
  private cloudinaryDeleteVideoUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/video/destroy`;


  constructor(private http: HttpClient) {}

  // Upload image (removing unnecessary parameters)
  uploadImage(formData: FormData) {
    return this.http.post<{ secure_url: string }>(this.cloudinaryUploadUrl, formData);
  }

// Upload video
uploadVideo(formData: FormData): Observable<any> {
  formData.append('resource_type', 'video'); // تعيين نوع المورد إلى فيديو
  return this.http.post<any>(`https://api.cloudinary.com/v1_1/dzmcteb1t/video/upload`, formData);
}


// Delete video by public_id
deleteVideo(publicId: string) {
  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('resource_type', 'video'); // تعيين نوع المورد إلى فيديو
  formData.append('api_key', environment.cloudinary.apiKey); // استخدام api_key من البيئة
  formData.append('api_secret', environment.cloudinary.apiSecret); // استخدام api_secret من البيئة
  return this.http.post<any>(this.cloudinaryDeleteVideoUrl, formData); // استخدام عنوان URL الصحيح لحذف الفيديو
}

  // Delete image by public_id
  deleteImage(publicId: string) {
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', environment.cloudinary.apiKey); // استخدام api_key من البيئة
    formData.append('api_secret', environment.cloudinary.apiSecret); // استخدام api_secret من البيئة
    return this.http.post<any>(this.cloudinaryDeleteUrl, formData);
  }
}
