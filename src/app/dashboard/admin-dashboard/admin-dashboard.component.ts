import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '@/app/services/storage.service';
import { Router } from '@angular/router';
import { Course } from '../../services/course.model';
import Swal from 'sweetalert2';
import { MessageService } from '@/app/services/message.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { FirebaseError } from '@firebase/util';
import { Video } from '@/app/services/user.model';
import { environment } from '@/environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  adminName: string = '';
  adminGender: 'male' | 'female' = 'male';
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;
  showModal: boolean = false;
  isAddingNewCourse: boolean = false; // متغير يتحكم في حالة النموذج
  searchTerm: string = '';
  newCourse: Course = this.initializeNewCourse(); // New course instance
  message: string | undefined;

  constructor(
    private coursesService: CoursesService,
    private userService: UserService,
    private authService: AuthService,
    private stoargeService: StorageService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,

  ) {}

  ngOnInit(): void {
    this.loadAdminInfo();
    this.loadCourses();
    this.messageService.currentMessage.subscribe(message => this.message = message);
  }

  loadAdminInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      if (this.authService.isAdmin()) {
        this.adminName = currentUser.name;
        this.adminGender = currentUser.gender;
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = [...courses];
        this.saveCoursesTostorageService();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.showAlert('error', 'Error', 'Failed to load courses. Please try again.');
      }
    });
  }

  selectCourse(course: Course): void {
    this.selectedCourse = { ...course };
    this.showModal = true;
  }

  showAddCourseForm(): void {
    this.selectedCourse = null; // تأكد من تعيينه لقيمة null لإضافة دورة جديدة
    this.isAddingNewCourse = true; // لتتبع حالة إضافة دورة جديدة
    this.showModal = true; // عرض النموذج
    this.cd.detectChanges(); // فرض اكتشاف التغيير
  }


  handleSave(course: Course): void {
    if (course.id) {
      this.coursesService.updateCourse(course).subscribe({
        next: () => {
          const index = this.filteredCourses.findIndex(c => c.id === course.id);
          if (index !== -1) {
            this.filteredCourses[index] = course; // Update course
            this.saveCoursesTostorageService(); // Save updated courses to local storage
          }
          this.showModal = false; // Close the modal
          this.showAlert('success', 'Success', 'Course updated successfully.');
        },
        error: (error) => {
          console.error('Error updating course:', error);
          this.showAlert('error', 'Error', 'Failed to update course. Please try again.');
        }
      });
    } else {
      this.coursesService.addCourse(course).subscribe({
        next: () => {
          this.showAlert('success', 'Success', 'New course added successfully.');
          this.loadCourses(); // Reload courses
        },
        error: (error) => {
          console.error('Error adding course:', error);
          this.showAlert('error', 'Error', 'Failed to add new course. Please try again.');
        }
      });
    }
  }

  updateVideo(courseId: string, videoIndex: number, updatedVideo: Video): void {
    this.coursesService.updateVideo(courseId, videoIndex, updatedVideo);
  }



  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.selectedCourse) {
        this.selectedCourse.imageFile = file;
      } else {
        this.newCourse.imageFile = file;
      }
    }
  }

  getModalBackdropClass(): string {
    return this.showModal ? 'modal-backdrop show' : 'modal-backdrop';
  }

  getModalContentClass(): string {
    return this.showModal ? 'modal-content show' : 'modal-content';
  }

  isSelectedCourseValid(): boolean {
    return this.selectedCourse !== null && this.selectedCourse.id !== '';
  }

  deleteCourse(): void {
    if (this.isSelectedCourseValid()) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.coursesService.deleteCourse(this.selectedCourse!.id).subscribe({
            next: () => {
              this.showAlert('success', 'Deleted!', 'The course has been deleted.');
              this.loadCourses();
              this.selectedCourse = null;
            },
            error: (error) => {
              console.error('Error deleting course:', error);
              this.showAlert('error', 'Error', 'Failed to delete course. Please try again.');
            }
          });
        }
      });
    } else {
      this.showAlert('error', 'Error', 'No course selected to delete.');
    }
  }

  searchCourses(): void {
    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  private initializeNewCourse(): Course {
    return {
      id: '', // Ensure `id` is a string
      title: '',
      category: '',
      description: '',
      duration: '',
      startDate: '',
      price: 0,
      instructor: '', // Ensure all required fields are included
      imageUrl: '',
      imageFile: null,
      videos: [] // Ensure all required fields are included
    };
  }

  private saveCoursesTostorageService(): void {
    this.stoargeService.setItem('currentCourses', JSON.stringify(this.courses));
  }

  private showAlert(icon: 'success' | 'error', title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#ff6600'
    });
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.authService.logout()); // انتظار تسجيل الخروج
      await this.router.navigate(['/login']); // التوجيه بعد تسجيل الخروج
      window.location.reload(); // إعادة تحميل الصفحة
    } catch (error) {
      console.error('Logout error:', error); // معالجة الأخطاء
    }
  }

  getGenderTitle(): string {
    return this.adminGender === 'male' ? 'Herr' : 'Frau';
  }

  formatPrice(price: number | undefined): string {
    if (typeof price !== 'number' || isNaN(price)) {
      return 'Invalid Price'; // or handle it as needed
    }
    return `EGP ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  closeModal() {
    this.showModal = false; // إغلاق النموذج
  }
}
