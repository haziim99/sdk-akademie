import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '@/app/core/services/auth.service';
import { PaymentService } from '@/app/core/services/payment.service';
import { StorageService } from '@/app/core/services/storage.service';
import { UserService } from '@/app/core/services/user.service';
import { User,Course } from '@/app/core/models/user.model';
import { filter, firstValueFrom, Subscription, Observable } from 'rxjs';
import { CoursesService } from '@/app/core/services/courses.service';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { CloudinaryResponse } from '@/app/core/models/cloudinary-response.model';

@Component({
    selector: 'app-profile-management',
    templateUrl: './profile-management.component.html',
    styleUrls: ['./profile-management.component.scss'],
    standalone: false
})
export class ProfileManagementComponent implements OnInit, OnDestroy {
  user$: Observable<User | null>;
  user: User | null = null;
  courses: Course[] = [];
  availableCourses: Course[] = [];
  isEditing = false;
  updatedName = '';
  updatedEmail = '';
  updatedPhone: string | null = null;
  profilePictureUrl: string = 'assets/images/default-profile.png'; // Default image
  isSidebarOpen = false; // Default value
  dropdownOpen = false; // Default value
  menuOpen = false; // Default value
  currentLang = 'en'; // Default language
  isUploading: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private cloudName = 'dzmcteb1t';
  private uploadPreset = 'profile_preset';
  private userCollection: AngularFirestoreCollection<User>;
  private courseCollection: AngularFirestoreCollection<Course>;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService,
    private coursesService: CoursesService,
    private storageService: StorageService,
    private router: Router,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
  ) {
    this.userCollection = this.firestore.collection('users');
    this.courseCollection = this.firestore.collection('courses');
    this.user$ = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.user$.subscribe(user => {
        console.log('ProfileManagementComponent - Current user:', user);
        if (!user) {
          this.router.navigate(['/login']);
          return;
        }
        this.user = user;
        this.profilePictureUrl = this.user.profilePicture || 'assets/images/default-profile.jpg';
      })
    );

    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const queryParams = this.router.url.split('?')[1];
        if (queryParams && queryParams.includes('refresh')) {
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  editProfile(): void {
    if (this.user) {
      this.updatedName = this.user.name;
      this.updatedEmail = this.user.email;
      this.updatedPhone = this.user.phone || '';
    }
    this.isEditing = true;
  }

  async saveChanges(): Promise<void> {
    if (!this.user) return;

    const updatedData: Partial<User> = {
      name: this.updatedName || this.user.name,
      email: this.updatedEmail || this.user.email,
      phone: this.updatedPhone ?? this.user.phone,
      profilePicture: this.profilePictureUrl || undefined
    };

    try {
      const userDocRef = this.userCollection.doc(this.user.id);
      await userDocRef.update(updatedData);
      this.user = { ...this.user, ...updatedData } as User;
      this.storageService.setItem('currentUser', JSON.stringify(this.user));
      this.authService.updateCurrentUser(this.user);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully!',
        confirmButtonColor: '#ff6600'
      });
      this.isEditing = false;
    } catch (error) {
      console.error('Error updating profile', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile. Please try again later.',
        confirmButtonColor: '#ff6600'
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  getGenderTitle(): string {
    return this.user?.gender === 'male' ? 'Herr' : 'Frau';
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload an image file.',
        confirmButtonColor: '#ff6600'
      });
      return;
    }

    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: `The file size exceeds the ${maxSizeInMB}MB limit.`,
        confirmButtonColor: '#ff6600'
      });
      return;
    }

    console.log('Uploading profile picture:', file.name);
    this.uploadProfilePicture(file);
  }

  async uploadProfilePicture(file: File) {
    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    try {
      const response = await firstValueFrom(this.http.post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        formData
      ));
      console.log('Cloudinary response:', response);

      if (response && response.secure_url) {
        this.profilePictureUrl = response.secure_url;
        console.log('New profile picture URL:', this.profilePictureUrl);

        if (this.user) {
          await this.userCollection.doc(this.user.id).update({ profilePicture: this.profilePictureUrl });
          console.log('Profile picture updated in Firestore');

          // تحديث في AuthService
          this.authService.updateProfilePicture(this.profilePictureUrl).subscribe({
            next: () => {
              console.log('Profile picture updated in AuthService');
            },
            error: (err) => {
              console.error('Error updating profile picture in AuthService:', err);
            }
          });

          this.user.profilePicture = this.profilePictureUrl;
          this.storageService.setItem('currentUser', JSON.stringify(this.user));

          Swal.fire({
            icon: 'success',
            title: 'Profile Picture Updated',
            text: 'Your profile picture has been updated successfully!',
            confirmButtonColor: '#ff6600'
          });
        }
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'There was an error uploading the profile picture. Please try again.',
        confirmButtonColor: '#ff6600'
      });
    } finally {
      this.isUploading = false;
    }
  }

  resetProfilePicture(): void {
    this.profilePictureUrl = 'assets/images/default-profile.jpg';
    this.fileInput.nativeElement.value = ''; // Clear file input
    if (this.user) {
      this.updateProfilePicture('assets/images/default-profile.jpg');
    }
  }

  updateProfilePicture(url: string): void {
    if (!this.user) return;

    const updatedData: Partial<User> = {
      profilePicture: url
    };

    this.userCollection.doc(this.user.id).update(updatedData).then(() => {
      this.user!.profilePicture = url;
      this.storageService.setItem('currentUser', JSON.stringify(this.user));
      this.authService.updateCurrentUser(this.user!);
      Swal.fire({
        icon: 'success',
        title: 'Profile Picture Reset',
        text: 'Your profile picture has been reset successfully!',
        confirmButtonColor: '#ff6600'
      });
    }).catch(error => {
      console.error('Error resetting profile picture:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reset profile picture. Please try again later.',
        confirmButtonColor: '#ff6600'
      });
    });
  }

  navigateBack(): void {
    this.router.navigate(['/admin-dashboard']); // تأكد من تعديل المسار حسب الحاجة
  }
}
