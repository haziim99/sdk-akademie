import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { CoursesService } from '../services/courses.service';
import { Course } from '../services/course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = []; // قائمة الدورات المتاحة
  filteredCourses: Course[] = []; // الدورات المفلترة
  selectedTab: string = 'registered'; // التبويب الافتراضي
  cart: Set<string> = new Set(); // تتبع الدورات المضافة بواسطة المعرف
  isLoggedIn: boolean = false; // تتبع حالة تسجيل الدخول
  levelSelected: boolean = false; // علامة لتحديد مستوى المستخدم
  showAll: boolean = false; // تتبع ما إذا كان يجب عرض جميع الدورات أم الدورات المفلترة
  selectedLevel!: string; // تخزين المستوى المحدد

  constructor(
    private router: Router,
    private authService: AuthService,
    private coursesService: CoursesService // استخدام CoursesService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn(); // تحديث حالة تسجيل الدخول
    this.loadCourses(); // تحميل الدورات المتاحة
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: data => {
        console.log('Data received:', data); // تحقق من البيانات المستلمة
        this.courses = data;
        this.filteredCourses = this.courses; // تهيئة filteredCourses بكل الدورات
        // إذا كان هناك مستوى محدد، قم بتطبيق الفلترة
        if (this.selectedLevel) {
          this.selectLevel(this.selectedLevel);
        }
      },
      error: error => {
        console.error('Error loading courses:', error);
      }
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  toggleCourses(): void {
    this.showAll = !this.showAll;

    if (this.showAll) {
      this.filteredCourses = this.courses;
    } else {
      if (this.selectedLevel) {
        this.selectLevel(this.selectedLevel);
      }
    }
  }

  selectLevel(level: string): void {
    this.levelSelected = true;
    this.selectedLevel = level;

    switch (level) {
      case 'beginner':
        this.filteredCourses = this.courses.filter(course =>
          course.level === 'beginner'
        );
        break;
      case 'intermediate':
        this.filteredCourses = this.courses.filter(course =>
          course.level === 'intermediate'
        );
        break;
      case 'advanced':
        this.filteredCourses = this.courses.filter(course =>
          course.level === 'advanced'
        );
        break;
      default:
        this.filteredCourses = this.courses;
    }
  }

  addToCart(course: Course): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/payment-method'], { queryParams: { courseId: course.id } });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Please Log In',
        text: 'You need to log in to proceed to payment.',
        confirmButtonColor: '#ff5722'
      }).then(() => {
        this.router.navigate(['/login'], { queryParams: { redirectTo: `/payment-method?courseId=${course.id}` } });
      });
    }
  }

  contactUs(): void {
    this.router.navigate(['/contact']);
    Swal.fire({
      icon: 'info',
      title: 'Contact Us',
      text: 'Please contact us at contact@example.com for more information.',
      confirmButtonColor: '#ff5722'
    });
  }
}
