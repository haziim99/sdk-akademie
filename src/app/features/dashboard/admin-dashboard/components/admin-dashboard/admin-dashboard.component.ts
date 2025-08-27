import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

// Services
import { CoursesService } from '@/app/core/services/courses.service';
import { UserService } from '@/app/core/services/user.service';
import { AuthService } from '@/app/core/services/auth.service';
import { StorageService } from '@/app/core/services/storage.service';
import { MessageService } from '@/app/core/services/message.service';

// Models
import { Course } from '@/app/core/models/course.model';
import { Video } from '@/app/core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  // Admin info
  adminName: string = '';
  adminGender: 'male' | 'female' = 'male';

  // Courses
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;
  newCourse: Course = this.initializeNewCourse();

  // Modal state
  showModal: boolean = false;
  isAddingNewCourse: boolean = false;

  // Search
  searchTerm: string = '';

  // Messages
  message: string | undefined;

  constructor(
    private coursesService: CoursesService,
    private userService: UserService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAdminInfo();
    this.loadCourses();
    this.messageService.currentMessage.subscribe(msg => this.message = msg);
  }

  /** Load courses from service */
  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = [...courses];
        this.saveCoursesToStorage();
        console.log('Courses loaded:', courses);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.showAlert('error', 'Error', 'Failed to load courses. Please try again.');
      }
    });
  }

  /** Load admin info */
  loadAdminInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.adminName = currentUser.name;
    this.adminGender = currentUser.gender;
  }

  /** Select course for view or edit */
  selectCourse(course: Course): void {
    this.selectedCourse = { ...course };
    console.log('Selected course:', this.selectedCourse);
    this.showModal = true;
  }

  /** Show add new course form */
  showAddCourseForm(): void {
    this.selectedCourse = null;
    this.isAddingNewCourse = true;
    this.showModal = true;
    this.cd.detectChanges();
  }

  /** Save or update course */
  handleSave(course: Course): void {
    if (course.id) {
      this.updateCourse(course);
    } else {
      this.addNewCourse(course);
    }
  }

  private updateCourse(course: Course): void {
    this.coursesService.updateCourse(course).subscribe({
      next: () => {
        const index = this.filteredCourses.findIndex(c => c.id === course.id);
        if (index !== -1) this.filteredCourses[index] = course;
        this.saveCoursesToStorage();
        this.showModal = false;
        this.showAlert('success', 'Success', 'Course updated successfully.');
      },
      error: (err) => {
        console.error('Error updating course:', err);
        this.showAlert('error', 'Error', 'Failed to update course. Please try again.');
      }
    });
  }

  private addNewCourse(course: Course): void {
    this.coursesService.addCourse(course).subscribe({
      next: () => {
        this.showAlert('success', 'Success', 'New course added successfully.');
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error adding course:', err);
        this.showAlert('error', 'Error', 'Failed to add new course. Please try again.');
      }
    });
  }

  /** Delete selected course */
  deleteCourse(): void {
    if (!this.selectedCourse?.id) {
      this.showAlert('error', 'Error', 'No course selected to delete.');
      return;
    }

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
          error: (err) => {
            console.error('Error deleting course:', err);
            this.showAlert('error', 'Error', 'Failed to delete course. Please try again.');
          }
        });
      }
    });
  }

  /** Filter courses by search term */
  searchCourses(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term)
    );
  }

  /** Handle file input change */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (this.selectedCourse) {
      this.selectedCourse.imageFile = file;
    } else {
      this.newCourse.imageFile = file;
    }
  }

  /** Update video in course */
  updateVideo(courseId: string, videoIndex: number, updatedVideo: Video): void {
    this.coursesService.updateVideo(courseId, videoIndex, updatedVideo);
  }

  /** Navigate to video management page */
  openVideoManagement(courseId: string) {
    this.router.navigate(['/manage-videos', courseId]);
  }

  /** Close modal */
  closeModal(): void {
    this.showModal = false;
  }

  /** Get modal backdrop CSS class */
  getModalBackdropClass(): string {
    return this.showModal ? 'modal-backdrop show' : 'modal-backdrop';
  }

  /** Get modal content CSS class */
  getModalContentClass(): string {
    return this.showModal ? 'modal-content show' : 'modal-content';
  }

  /** Check if selected course is valid */
  isSelectedCourseValid(): boolean {
    return !!this.selectedCourse?.id;
  }

  /** Logout user */
  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.authService.logout());
      await this.router.navigate(['/login']);
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  /** Get title based on gender */
  getGenderTitle(): string {
    return this.adminGender === 'male' ? 'Herr' : 'Frau';
  }

  /** Format price for display */
  formatPrice(price: number | undefined): string {
    if (!price || isNaN(price)) return 'Invalid Price';
    return `EGP ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /** Navigate to route */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /** Initialize empty new course */
  private initializeNewCourse(): Course {
    return {
      id: '',
      title: '',
      category: '',
      description: '',
      duration: '',
      startDate: '',
      price: 0,
      instructor: '',
      imageUrl: '',
      imageFile: null,
      videos: [],
      videoUrl: ''
    };
  }

  /** Save courses to local storage */
  private saveCoursesToStorage(): void {
    this.storageService.setItem('currentCourses', JSON.stringify(this.courses));
  }

  /** Show alert using SweetAlert2 */
  private showAlert(icon: 'success' | 'error', title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#ff6600'
    });
  }

}
