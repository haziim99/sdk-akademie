import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '@/app/core/services/courses.service';
import { CloudinaryService } from '@/app/core/services/cloudinary.service';
import { AuthService } from '@/app/core/services/auth.service';
import { Course, Video, UploadResponse } from '@/app/core/models/user.model';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-manage-videos',
    templateUrl: './manage-videos.component.html',
    styleUrls: ['./manage-videos.component.scss'],
    standalone: false
})
export class ManageVideosComponent implements OnInit {
  course: Course | undefined;
  videos: Video[] = [];
  newVideoTitle: string = '';
  newVideoUrl: string = '';
  selectedVideoFile: File | null = null;
  courseId: string = '';
  isLoading = true;
  refreshTime = 60000;
  player: any;
  videoUrl: string = '';
  isFileSelected: boolean = false;
  isUrlSelected: boolean = false;
  currentVideoUrl!: string;
  currentVideoTitle!: string;


  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private cloudinaryService: CloudinaryService,
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseId = courseId;
      this.loadCourseDetails(courseId);
    }
  }

  playVideo(url: string, title: string): void {
    if (url && title) {
      this.currentVideoUrl = url;
      this.currentVideoTitle = title;
    }
  }

  async loadCourseDetails(courseId: string): Promise<void> {
    try {
      const courses = await firstValueFrom(this.coursesService.getCourses());
      this.course = courses.find(course => course.id === courseId);
      if (this.course) {
        this.videos = this.course.videos || [];
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
      this.selectedVideoFile = file;
    }
  }

  async deleteVideo(index: number): Promise<void> {
    const videoToDelete = this.videos[index];
    if (videoToDelete && this.course) {
      this.videos.splice(index, 1);
      this.course.videos = this.videos;
      await firstValueFrom(this.coursesService.updateCourse(this.course));
    }
  }

  async addVideo(): Promise<void> {
    // Check admin permissions
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.role !== 'admin') {
      console.error('Only admins can upload videos.');
      return;
    }

    let videoUrl = '';

    // Handle file upload
    if (this.isFileSelected && this.selectedVideoFile && this.newVideoTitle) {
      try {
        const formData = new FormData();
        formData.append('file', this.selectedVideoFile);
        formData.append('upload_preset', 'video_upload');

        const uploadResponse: UploadResponse = await firstValueFrom(this.cloudinaryService.uploadVideo(formData));
        videoUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error('Error uploading video:', error);
        return;
      }
    }
    // Handle URL input
    else if (this.isUrlSelected && this.newVideoUrl && this.newVideoTitle) {
      videoUrl = this.newVideoUrl;
    } else {
      console.error('Please provide title and video source.');
      return;
    }

    // Add video to course
    const newVideo: Video = {
      title: this.newVideoTitle,
      url: videoUrl
    };

    this.videos.push(newVideo);

    if (this.course) {
      this.course.videos = this.videos;
      await firstValueFrom(this.coursesService.updateCourse(this.course));
      this.playVideo(newVideo.url, newVideo.title);
    }

    // Reset form
    this.resetForm();
  }

  private resetForm(): void {
    this.newVideoTitle = '';
    this.newVideoUrl = '';
    this.selectedVideoFile = null;
    this.isFileSelected = false;
    this.isUrlSelected = false;
  }

  selectFile(): void {
    this.isFileSelected = true;
    this.isUrlSelected = false;
  }

  selectUrl(): void {
    this.isFileSelected = false;
    this.isUrlSelected = true;
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
