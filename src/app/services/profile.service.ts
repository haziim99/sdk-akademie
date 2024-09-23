import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private storage: AngularFireStorage, private authService: AuthService) { }

  uploadProfilePicture(file: File): Observable<string> {
    const userId = this.authService.getCurrentUser(); // Assuming you have a method to get the current user ID
    const filePath = `profile_pictures/${userId}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    return from(fileRef.put(file)).pipe(
      switchMap(() => fileRef.getDownloadURL())
    );
  }

  deleteProfilePicture(): Observable<void> {
    const userId = this.authService.getCurrentUser();
    const filePath = `profile_pictures/${userId}`;
    return from(this.storage.ref(filePath).delete());
  }
}
