import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '@/app/services/courses.service';
import { CloudinaryService } from '@/app/services/cloudinary.service';
import { AuthService } from '@/app/services/auth.service';
import { Course, Video, UploadResponse } from '@/app/services/user.model';
import { firstValueFrom } from 'rxjs';
import videojs from 'video.js';

@Component({
  selector: 'app-manage-videos',
  templateUrl: './manage-videos.component.html',
  styleUrls: ['./manage-videos.component.scss']
})
export class ManageVideosComponent implements OnInit {
  course: Course | undefined;
  videos: Video[] = [];
  newVideoTitle: string = '';
  newVideoUrl: string = '';
  selectedVideoFile: File | null = null;
  courseId: string = '';
  isLoading = true; // حالة التحميل
  refreshTime = 60000; // وقت الانتعاش بالمللي ثانية (60 ثانية)
  player: any; // استخدم 'any' مؤقتاً
  videoUrl: string = ''; // URL الذي سيدخله المستخدم
  isFileSelected: boolean = false;
  isUrlSelected: boolean = false;


  currentVideoUrl!: string; // استخدام ! للتحقق من التعريف
  currentVideoTitle!: string; // استخدام ! للتحقق من التعريف

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private cloudinaryService: CloudinaryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    console.log('Course ID:', courseId);
    console.log(`Updating video to: ${this.currentVideoUrl} with title: ${this.currentVideoTitle}`);

    if (courseId) {
      this.courseId = courseId; // تخزين معرف الدورة
      this.loadCourseDetails(courseId);
      // إعداد الانتعاش الدوري
      this.setupRefresh();
    } else {
      console.error('No course ID found in the route');
    }
  }

  playVideo(url: string, title: string) {
    if (url && title) {
        this.currentVideoUrl = url;
        this.currentVideoTitle = title;
        console.log(`Playing Video: ${title} ${url}`);

        // Check if the player is defined
        if (this.player) {
            this.player.src({ type: 'video/mp4', src: this.currentVideoUrl });
            this.player.load(); // Ensure the player loads the new video
            this.player.play().catch((error: any) => {
                console.error('Error playing the video:', error);
            });
        } else {
            console.error('Video player is not initialized');
        }
    } else {
        console.error('Invalid video URL or title:', url, title);
    }
    this.player.requestFullscreen();
}

  setupRefresh(): void {
    setInterval(() => {
      if (this.courseId) {
        this.loadCourseDetails(this.courseId);
      }
    }, this.refreshTime);
  }

  async loadCourseDetails(courseId: string): Promise<void> {
    try {
        const courses = await firstValueFrom(this.coursesService.getCourses());
        console.log('Loaded courses:', courses); // لوج للدورات المحملة

        // تسجيل معرف الدورة
        console.log('Course ID:', courseId, typeof courseId);
        courses.forEach(course => console.log('Loaded Course ID:', course.id, typeof course.id));

        // البحث عن الدورة
        this.course = courses.find(course => course.id === courseId);
        console.log('Selected course:', this.course); // لوج للدورة المحددة

        if (this.course) {
            this.videos = this.course.videos || [];
        } else {
            console.error('Course not found');
        }
    } catch (error) {
        console.error('Error loading course details', error);
    } finally {
        this.isLoading = false;
    }
}


  onVideoFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = file; // تخزين الملف المختار
      console.log('Video file selected:', this.selectedVideoFile);
    } else {
      console.error('No video file selected');
    }
  }

  async deleteVideo(index: number): Promise<void> {
    const videoToDelete = this.videos[index];
    if (videoToDelete) {
      // هنا يمكنك استدعاء دالة لحذف الفيديو من Cloudinary إذا كان مطلوبًا
      this.videos.splice(index, 1);

      if (this.course) {
        this.course.videos = this.videos;
        await firstValueFrom(this.coursesService.updateCourse(this.course));
        console.log('Video deleted successfully');
      }
    }
  }

  async addVideo(): Promise<void> {
    console.log('New Video Title:', this.newVideoTitle);
    console.log('Selected Video File:', this.selectedVideoFile);

    if (!this.newVideoTitle || !this.selectedVideoFile) {
      console.error('Please provide both a title and a video file.');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      console.error('Only admins can upload videos.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedVideoFile);
    formData.append('upload_preset', 'video_upload');

    try {
      const uploadResponse: UploadResponse = await firstValueFrom(this.cloudinaryService.uploadVideo(formData));
      console.log('Upload Response:', uploadResponse);

      const newVideo: Video = {
        title: this.newVideoTitle,
        url: uploadResponse.secure_url
      };

      this.videos.push(newVideo);
      console.log('Videos after adding new video:', this.videos);

      if (this.course) {
        this.course.videos = this.videos;
        await firstValueFrom(this.coursesService.updateCourse(this.course));
        console.log('Course updated successfully');
      }

      this.newVideoTitle = '';
      this.selectedVideoFile = null;
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  selectFile() {
    this.isFileSelected = true;
    this.isUrlSelected = false;
  }

  selectUrl() {
    this.isFileSelected = false;
    this.isUrlSelected = true;
  }
}
