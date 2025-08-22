import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { StorageService } from '../../services/storage.service';
import { UserService } from '@/app/services/user.service';
import { User, Course } from '../../services/models/user.model';
import { filter, firstValueFrom, Subscription, Observable } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { SupportService, SupportTicket, SupportResponse, NewSupportTicket } from '../../services/support.service';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { CloudinaryResponse } from '@/app/services/models/cloudinary-response.model';
import { Timestamp } from 'firebase/firestore';
import 'firebase/firestore';
import $ from 'jquery';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user$: Observable<User | null>;
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

   // Support-related properties
  newTicket: NewSupportTicket = {
    subject: '',
    description: '',
    status: 'open',
    responses: []
  };

  userTickets: SupportTicket[] = [];
  selectedTicket: SupportTicket | null = null;
  newReply: string = '';
  isSubmitting: boolean = false;
  isReplying: boolean = false;

  private cloudName = 'dzmcteb1t';
  private uploadPreset = 'profile_preset';
  private userCollection: AngularFirestoreCollection<User>;
  private courseCollection: AngularFirestoreCollection<Course>;
  private subscriptions: Subscription = new Subscription();
response: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService,
    private coursesService: CoursesService,
    private storageService: StorageService,
    private supportService: SupportService,
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
        console.log('ProfileComponent - Current user:', user);
        if (!user) {
          this.router.navigate(['/login']);
          return;
        }
        this.user = user;
        this.profilePictureUrl = this.user.profilePicture || 'assets/images/default-profile.jpg';
        this.loadCourses();
        this.fetchUserTickets();
      })
    );

    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const queryParams = this.router.url.split('?')[1];
        if (queryParams && queryParams.includes('refresh')) {
          this.loadCourses();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Fetch user's support tickets
  fetchUserTickets(): void {
    if (this.user) {
      this.supportService.getUserTickets(this.user.id).subscribe(
        tickets => {
          this.userTickets = tickets;
          console.log('Fetched tickets:', this.userTickets);
        },
        error => {
          console.error('Error fetching user tickets:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch support tickets.',
            confirmButtonColor: '#ff6600'
          });
        }
      );
    }
  }

  // Submit a new support ticket
  async submitTicket(): Promise<void> {
    if (!this.user) return;

    if (!this.newTicket.subject.trim() || !this.newTicket.description.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Information',
            text: 'يرجى تقديم كل من الموضوع والوصف للتذكرة.',
            confirmButtonColor: '#ff6600'
        });
        return;
    }

    this.isSubmitting = true;

    const ticket: SupportTicket = {
        userId: this.user.id,
        subject: this.newTicket.subject.trim(),
        description: this.newTicket.description.trim(),
        status: 'open',
        responses: [],
        createdAt: Timestamp.fromDate(new Date()), // تحويل Date إلى Firestore Timestamp
        lastUpdated: Timestamp.fromDate(new Date()) // تحويل Date إلى Firestore Timestamp
    };

    try {
        await this.supportService.submitTicket(ticket);
        Swal.fire({
            icon: 'success',
            title: 'تم إرسال التذكرة',
            text: 'تم إرسال تذكرتك بنجاح.',
            confirmButtonColor: '#ff6600'
        });
        // إعادة تعيين النموذج
        this.newTicket = { subject: '', description: '', status: 'open', responses: [] };
    } catch (error) {
        console.error('خطأ في إرسال التذكرة:', error);
        Swal.fire({
            icon: 'error',
            title: 'فشل الإرسال',
            text: 'حدث خطأ أثناء إرسال تذكرتك. يرجى المحاولة لاحقًا.',
            confirmButtonColor: '#ff6600'
        });
    } finally {
        this.isSubmitting = false;
    }
}


  // View ticket details
  viewTicket(ticket: SupportTicket): void {
    this.selectedTicket = ticket;
    // Open the modal
    ($('#ticketModal') as any).modal('show');
  }

  // Close ticket modal
  closeTicketModal(): void {
    this.selectedTicket = null;
    // Close the modal
    ($('#ticketModal') as any).modal('hide');
  }

  // Send a reply to the selected ticket
  /* async sendReply(): Promise<void> {
    if (!this.selectedTicket || !this.newReply.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please enter a valid reply.',
        confirmButtonColor: '#ff6600'
      });
      return;
    }

    this.isReplying = true;

    const response: SupportResponse = {
      author: 'Admin', // You can modify this to reflect the admin's name or role
      message: this.newReply.trim(),
      date: firebase.firestore.Timestamp.now(),
    };

    const updatedResponses = [...this.selectedTicket.responses, response];
    const updatedStatus = 'closed'; // Optionally, change status to 'closed' after reply

    try {
      await this.supportService.updateTicket(this.selectedTicket.id!, {
        responses: updatedResponses,
        status: updatedStatus
      });
      Swal.fire({
        icon: 'success',
        title: 'Reply Sent',
        text: 'Your reply has been sent successfully.',
        confirmButtonColor: '#ff6600'
      });
      // Refresh the selected ticket
      this.fetchUserTickets();
      this.closeTicketModal();
      this.newReply = '';
    } catch (error) {
      console.error('Error sending reply:', error);
      Swal.fire({
        icon: 'error',
        title: 'Reply Failed',
        text: 'There was an error sending your reply. Please try again later.',
        confirmButtonColor: '#ff6600'
      });
    } finally {
      this.isReplying = false;
    }
  } */

  async loadCourses(): Promise<void> {
    try {
      // Load user's courses
      this.courses = this.user?.courses || [];

      // Load available courses
      const allCoursesSnapshot = await firstValueFrom(this.coursesService.getCourses());
      this.availableCourses = (allCoursesSnapshot as Course[]).filter(
        course => !this.courses.some(userCourse => userCourse.id === course.id)
      );
      console.log('Available courses:', this.availableCourses);
    } catch (error) {
      console.error('Error loading courses', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load courses.',
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

      if (userCourses.some((userCourse: { id: string }) => userCourse.id === courseId)) {
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
        await this.loadCourses();

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
          const userCoursesSnapshot = await firstValueFrom(userDocRef.get());
          console.log('User courses snapshot before deletion:', userCoursesSnapshot);
          const userCourses = userCoursesSnapshot?.data()?.['courses'] || [];
          const updatedCourses = userCourses.filter((course: { id: string }) => course.id !== courseId);

          await userDocRef.update({ courses: updatedCourses });

          await this.loadCourses(); // Refresh profile and courses after deletion
          this.availableCourses = await firstValueFrom(this.coursesService.getCourses()).then(allCourses => {
            return (allCourses as Course[]).filter(course => !this.courses.some(userCourse => userCourse.id === course.id));
          });
          console.log('Available courses after deletion:', this.availableCourses);
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

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']).then(() => {
        window.location.reload(); // إعادة تحميل الصفحة
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
  // Implement the logic to update the profile picture
  // This might involve calling a service to update the user profile
}


}
