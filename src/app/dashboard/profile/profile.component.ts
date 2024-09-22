import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { StorageService } from '../../services/storage.service';
import { UserService } from '@/app/services/user.service';
import { User, Course } from '../../services/user.model';
import { filter, firstValueFrom, Observable, of } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { CloudinaryResponse } from '@/app/services/cloudinary-response.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  courses: Course[] = [];
  availableCourses: Course[] = [];
  isEditing = false;
  updatedName = '';
  updatedEmail = '';
  updatedPhone: string | null = null;
  userProfileImage: string = 'assets/images/default-profile.png'; // Default image
  isSidebarOpen = false; // Default value
  dropdownOpen = false; // Default value
  menuOpen = false; // Default value
  currentLang = 'en'; // Default language
  profilePictureUrl: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  isUploading: boolean = false;



  private cloudName = 'dzmcteb1t';
  private uploadPreset = 'profile_preset';
  private userCollection: AngularFirestoreCollection<User>;
  private courseCollection: AngularFirestoreCollection<Course>;

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
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProfileAndCourses();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const queryParams = this.router.url.split('?')[1];
      if (queryParams && queryParams.includes('refresh')) {
        this.loadProfileAndCourses();
      }
    });
  }

  async loadProfileAndCourses(): Promise<void> {
    try {
      // تأكد من الحصول على بيانات المستخدم بشكل صحيح
      const userId = await firstValueFrom(this.authService.currentUser).then(user => user?.id);
      if (!userId) {
        this.router.navigate(['/login']);
        return;
      }

      this.user = await this.userService.getUser(userId);
      if (!this.user) {
        console.error('User is null or undefined');
        this.router.navigate(['/login']);
        return;
      }

      this.profilePictureUrl = this.user.profilePicture || 'assets/images/default-profile.jpg';

      // Load user's courses
      this.courses = this.user.courses || [];

      // Load available courses
      const allCoursesSnapshot = await firstValueFrom(this.coursesService.getCourses());
      this.availableCourses = (allCoursesSnapshot as Course[]).filter(
        course => !this.courses.some(userCourse => userCourse.id === course.id)
      );
    } catch (error) {
      console.error('Error loading profile and courses', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load profile or courses.',
        confirmButtonColor: '#ff6600'
      });
    }
  }

  async buyCourse(courseId: string): Promise<void> {
    if (!this.user) {
      Swal.fire({
        icon: 'error',
        title: 'User Not Found',
        text: 'User is not logged in or does not exist.',
        confirmButtonColor: '#ff6600'
      });
      return;
    }

    try {
      console.log('Buying course:', courseId);

      const courseDocRef = this.courseCollection.doc(courseId);
      const courseSnapshot = await firstValueFrom(courseDocRef.get());

      if (!courseSnapshot.exists) {
        Swal.fire({
          icon: 'error',
          title: 'Course Not Found',
          text: 'The selected course does not exist.',
          confirmButtonColor: '#ff6600'
        });
        return;
      }

      const course = courseSnapshot.data() as Course;
      const coursePrice = course.price ?? 0;

      console.log('Course found:', course);
      console.log('Course price:', coursePrice);

      const userDocRef = this.userCollection.doc(this.user.id);
      const userSnapshot = await firstValueFrom(userDocRef.get());
      const userCourses = userSnapshot.data()?.courses || [];

      console.log('User courses before purchase:', userCourses);

      if (userCourses.some(userCourse => userCourse.id === courseId)) {
        Swal.fire({
          icon: 'info',
          title: 'Already Purchased',
          text: 'You have already purchased this course.',
          confirmButtonColor: '#ff6600'
        });
        return;
      }

      const { value: selectedMethod } = await Swal.fire({
        title: `Purchase ${course.title}`,
        html: `Price: ${coursePrice} EGP<br>Choose a payment method:`,
        input: 'select',
        inputOptions: {
          'paypal': 'PayPal',
          'credit-card': 'Credit Card',
          'bank-transfer': 'Bank Transfer'
        },
        inputPlaceholder: 'Select a payment method',
        confirmButtonColor: '#ff6600',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed to Payment',
        showLoaderOnConfirm: true,
        preConfirm: async (method) => {
          if (!['paypal', 'credit-card', 'bank-transfer'].includes(method)) {
            Swal.showValidationMessage('Invalid payment method.');
            return false;
          }
          return method;
        }
      });

      if (!selectedMethod) return;

      const paymentData = {
        courseId,
        amount: coursePrice,
        currency: 'EGP',
        userId: this.user.id,
      };

      const paymentResponse = await firstValueFrom(this.paymentService.processPayment(selectedMethod, paymentData));

      if (paymentResponse.success) {
        const updatedCourses = [...userCourses, course];

        console.log('Updated user courses:', updatedCourses);

        await userDocRef.update({ courses: updatedCourses });

        // Verify if the course list is updated correctly
        await this.loadProfileAndCourses();

        Swal.fire({
          icon: 'success',
          title: 'Purchase Successful',
          text: 'You have successfully purchased the course!',
          confirmButtonColor: '#ff6600'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Purchase Failed',
          text: 'There was an error during the purchase process. Please try again.',
          confirmButtonColor: '#ff6600'
        });
      }
    } catch (error) {
      console.error('Error processing payment or updating courses', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to process payment or update courses. Please try again later.',
        confirmButtonColor: '#ff6600'
      });
    }
  }


  async deleteCourse(courseId: string): Promise<void> {
    if (!this.user) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6600',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userDocRef = this.userCollection.doc(this.user!.id);
          const userCoursesSnapshot = await userDocRef.get().toPromise();
          console.log('User courses snapshot before deletion:', userCoursesSnapshot); // تتبع قبل الحذف
          const userCourses = userCoursesSnapshot?.data()?.['courses'] || [];
          const updatedCourses = userCourses.filter((course: { id: string }) => course.id !== courseId);

          await userDocRef.update({ courses: updatedCourses });

          await this.loadProfileAndCourses(); // Refresh profile and courses after deletion
          this.availableCourses = await firstValueFrom(this.coursesService.getCourses());
          console.log('Available courses after deletion:', this.availableCourses); // تتبع الكورسات المتاحة بعد الحذف
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The course has been deleted.',
            confirmButtonColor: '#ff6600'
          });
        } catch (error) {
          console.error('Error deleting course', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete course. Please try again later.',
            confirmButtonColor: '#ff6600'
          });
        }
      }
    });
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
      profilePicture: this.profilePictureUrl || undefined // Use undefined instead of null
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToCourseOverview(courseId: string): void {
    this.router.navigate(['/course-overview', courseId]);
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

    this.uploadProfilePicture(file);
  }

  async uploadProfilePicture(file: File) {
    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset); // Use the specified preset

    try {
      const response = await firstValueFrom(this.http.post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        formData
      ));
      console.log('Cloudinary response:', response); // تتبع استجابة Cloudinary

      if (response && response.secure_url) {
        this.profilePictureUrl = response.secure_url;

        if (this.user) {
          await this.userCollection.doc(this.user.id).update({ profilePicture: this.profilePictureUrl });
          this.authService.updateProfilePicture(this.profilePictureUrl);

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
  }
}
