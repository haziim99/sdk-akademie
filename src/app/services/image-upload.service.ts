import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private uploadUrl = '/.netlify/functions/upload'; // URL لـ Netlify Function

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.uploadUrl, formData);
  }

  // دالة لمعالجة رفع الصورة وعرض رسالة الخطأ إذا لزم الأمر
  processImageUpload(file: File): Observable<any> {
    return this.uploadImage(file).pipe(
      catchError(error => {
        console.error('Error uploading file:', error);
        return of({ error: 'Failed to upload image. Please try again.' });
      })
    );
  }
}
