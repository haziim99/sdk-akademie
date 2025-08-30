import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { Course } from '../../../../core/models/user.model';

declare const Plyr: any;

@Component({
    selector: 'app-course-details',
    templateUrl: './course-detail.component.html',
    styleUrls: ['./course-detail.component.scss'],
    standalone: false
})
export class CourseDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  course: Course | undefined;
  showVideos: boolean = false;
  selectedVideoUrl: string | undefined;
  selectedVideoTitle: string | undefined;

  @ViewChild('videoContainer', { static: false }) videoContainer?: ElementRef;
  @ViewChild('plyrPlayer', { static: false }) plyrPlayerElement?: ElementRef;
  plyr: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      this.loadCourseDetails(courseId);
    });
  }

  ngAfterViewInit(): void {
    // Ensure Plyr is available and the element is defined before using it
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && this.plyrPlayerElement?.nativeElement) {
      this.plyr = new Plyr(this.plyrPlayerElement.nativeElement, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up Plyr instance if it exists
    if (this.plyr) {
      this.plyr.destroy();
    }
  }

  loadCourseDetails(id: string): void {
    this.userService.getAvailableCourses().subscribe((courses: Course[]) => {
      this.course = courses.find(course => course.id === id);
    });
  }

  toggleVideos(): void {
    this.showVideos = !this.showVideos;
  }

  selectVideo(url: string, title: string): void {
    this.selectedVideoUrl = url;
    this.selectedVideoTitle = title;

    // Ensure Plyr is initialized and set the video source
    if (this.plyr) {
      this.plyr.source = {
        type: 'video',
        sources: [{
          src: url,
          type: 'video/mp4'
        }]
      };
      this.plyr.play();
    }

    // Scroll to the video container if it exists
    if (this.videoContainer?.nativeElement) {
      this.videoContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  enrollNow(): void {
    this.router.navigate(['/payment-method']);
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
