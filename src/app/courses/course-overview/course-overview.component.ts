import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service'; // استيراد الخدمة
import { Course } from '../../services/models/user.model';
import { CoursesService } from '../../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { Lecture } from '../../services/models/course.model';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit, AfterViewInit {
  course: Course | undefined;
  showDetails: boolean = false;
  showVideos: boolean = false;
  lectures: Lecture[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private coursesService: CoursesService,
    private http: HttpClient,
    private storageService: StorageService // إضافة StorageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      console.log('Course ID from route:', courseId);
      this.loadCourseDetails(courseId);
    });

    // Retrieve course details from storageService
    const storedCourse = this.storageService.getItem('selectedCourse');
    if (storedCourse) {
      this.course = JSON.parse(storedCourse);
      console.log('Restored course from storage:', this.course);
    }
  }


  ngAfterViewInit(): void {
    gsap.from('.course-header', { duration: 1, opacity: 0, y: -50, stagger: 0.2 });
    gsap.from('.course-details', { duration: 1, opacity: 0, y: 50, delay: 0.5 });
    gsap.from('.cta-buttons button', { duration: 1, opacity: 0, scale: 0.9, stagger: 0.2 });
  }

  async loadCourseDetails(id: string): Promise<void> {
    try {
      const courses = await firstValueFrom(this.coursesService.getCourses()); // استخدام firstValueFrom بدلاً من toPromise
      if (!courses) {
        console.warn('Courses data is undefined or null');
        return;
      }

      console.log('Available courses response:', courses);

      this.course = courses.find(course => course.id === id);

      if (this.course) {
        console.log('Selected course:', this.course);
        this.storageService.setItem('selectedCourse', JSON.stringify(this.course)); // Save the selected course
      } else {
        console.warn('Course not found for ID:', id);
      }
    } catch (error) {
        console.error('Error Fetching Course Details', error);
    }
  }



  loadCourseLectures(courseId: string): void {
    this.userService.getCourseLectures(courseId).subscribe({
      next: (response: Lecture[]) => {
        console.log('Lectures response:', response);
        this.lectures = response || [];
        console.log('Lectures:', this.lectures);
      },
      error: (error: any) => {
        console.error('Error fetching course lectures:', error);
      },
      complete: () => {
        // يمكنك إضافة معالجة هنا عند اكتمال الـ Observable إذا كان ذلك مطلوبًا
        console.log('Completed fetching course lectures.');
      }
    });


  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  toggleVideos(): void {
    this.showVideos = !this.showVideos;
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  enrollNow(): void {
    this.router.navigate(['/payment-method']);
  }
}
