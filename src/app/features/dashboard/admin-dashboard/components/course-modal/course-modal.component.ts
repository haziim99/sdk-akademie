import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '@/app/core/models/course.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { CloudinaryService } from '@/app/core/services/cloudinary.service';

@Component({
  selector: 'app-course-modal',
  templateUrl: './course-modal.component.html',
  styleUrls: ['./course-modal.component.scss']
})
export class CourseModalComponent {
  @Input() course: Course | null = null;
  @Output() save = new EventEmitter<Course>();
  @Output() close = new EventEmitter<void>();

  newCourse: Course = this.initializeNewCourse();
  uploadPercent: number = 0;
  downloadURL: string | undefined;
  selectedLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

  constructor(
    private storage: AngularFireStorage,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnChanges() {
    if (this.course) {
      this.newCourse = { ...this.course };
      this.selectedLevel = this.newCourse.level || 'beginner';
    } else {
      this.newCourse = this.initializeNewCourse();
      this.selectedLevel = 'beginner';
    }
  }

  private initializeNewCourse(): Course {
    return {
      id: '',
      title: '',
      category: 'German Course',
      description: '',
      duration: '',
      startDate: '',
      price: 0,
      instructor: '',
      imageUrl: '',
      imageFile: null,
      videos: [],
      videoUrl:'',
      level: 'beginner'
    };
  }

  async onSave() {
    if (this.isFormValid()) {
      if (this.newCourse.imageFile) {
        const imageUrl = await this.uploadImage(this.newCourse.imageFile);
        this.newCourse.imageUrl = imageUrl;
      }
      this.save.emit(this.newCourse);
      this.onClose();
    } else {
      alert('Please fill out all required fields before submitting.');
    }
  }

  onClose() {
    this.close.emit();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file).then((imageUrl) => {
        this.newCourse.imageUrl = imageUrl; // تخزين رابط الصورة
      }).catch(error => {
        console.error('Error uploading image:', error);
      });
    }
  }



  private async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'courses'); // Ensure this matches your preset name

    try {
      // Pass only the formData to the uploadImage function
      const response = await firstValueFrom(this.cloudinaryService.uploadImage(formData));
      if (response && response.secure_url) {
        return response.secure_url;
      } else {
        throw new Error('No secure_url found in the response');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }


  private async uploadVideo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'courses'); // Ensure this matches your preset name

    try {
      const response = await firstValueFrom(this.cloudinaryService.uploadVideo(formData));
      if (response && response.secure_url) {
        return response.secure_url;
      } else {
        throw new Error('No secure_url found in the response');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }



  onVideoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadVideo(file).then((videoUrl: string) => {
        this.newCourse.videos.push({ title: 'Video Title', url: videoUrl });
      }).catch((error: any) => {
        console.error('Error uploading video:', error);
      });
    }
  }




  isFormValid(): boolean {
    return !!this.newCourse.title?.trim() &&
            !!this.newCourse.description?.trim() &&
            !!this.newCourse.duration &&
            !!this.newCourse.instructor &&
            this.newCourse.price > 0 &&
            !!this.newCourse.startDate;
  }


  selectLevel(level: 'beginner' | 'intermediate' | 'advanced'): void {
    this.selectedLevel = level;
    this.newCourse.level = level;
  }

  isLevelSelected(level: 'beginner' | 'intermediate' | 'advanced'): boolean {
    return this.selectedLevel === level;
  }
}
