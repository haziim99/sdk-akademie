import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '@/app/core/models/course.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';
import { CloudinaryService } from '@/app/core/services/cloudinary.service';

@Component({
  selector: 'app-course-modal',
  templateUrl: './course-modal.component.html',
  styleUrls: ['./course-modal.component.scss'],
  standalone: false
})
export class CourseModalComponent {
  @Input() course: Course | null = null;
  @Output() save = new EventEmitter<Course>();
  @Output() close = new EventEmitter<void>();

  courseForm: FormGroup;
  uploadPercent: number = 0;
  downloadURL: string | undefined;

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private cloudinaryService: CloudinaryService
  ) {
    this.courseForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['German Course'],
      description: ['', [Validators.required, Validators.minLength(10)]],
      duration: ['', Validators.required],
      startDate: ['', Validators.required],
      instructor: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      level: ['beginner', Validators.required],
      imageUrl: [''],
      imageFile: [null],
      videos: [[]],
      videoUrl: ['']
    });
  }

  ngOnChanges() {
    if (this.course) {
      this.courseForm.patchValue({
        id: this.course.id,
        title: this.course.title,
        url: this.course.url || '',
        category: this.course.category,
        description: this.course.description,
        duration: this.course.duration,
        startDate: this.course.startDate,
        instructor: this.course.instructor,
        price: this.course.price,
        level: this.course.level || 'beginner',
        imageUrl: this.course.imageUrl,
        videos: this.course.videos || [],
        videoUrl: this.course.videoUrl || ''
      });
    } else {
      this.courseForm.reset({
        id: '',
        url: '',
        category: 'German Course',
        level: 'beginner',
        price: 0,
        imageUrl: '',
        imageFile: null,
        videos: [],
        videoUrl: ''
      });
    }
  }

  async onSave() {
    if (this.courseForm.valid) {
      const courseData = this.courseForm.value;

      // Handle image upload if file exists
      if (courseData.imageFile) {
        const imageUrl = await this.uploadImage(courseData.imageFile);
        courseData.imageUrl = imageUrl;
      }

      this.save.emit(courseData);
      this.onClose();
    } else {
      this.markFormGroupTouched();
      alert('Please fill out all required fields before submitting.');
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.courseForm.controls).forEach(key => {
      this.courseForm.get(key)?.markAsTouched();
    });
  }

  onClose() {
    this.close.emit();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.courseForm.patchValue({ imageFile: file });
      this.uploadImage(file).then((imageUrl) => {
        this.courseForm.patchValue({ imageUrl: imageUrl });
      }).catch(error => {
        console.error('Error uploading image:', error);
      });
    }
  }

  private async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'courses');

    try {
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
    formData.append('upload_preset', 'courses');

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
        const currentVideos = this.courseForm.get('videos')?.value || [];
        currentVideos.push({ title: 'Video Title', url: videoUrl });
        this.courseForm.patchValue({ videos: currentVideos });
      }).catch((error: any) => {
        console.error('Error uploading video:', error);
      });
    }
  }

  selectLevel(level: 'beginner' | 'intermediate' | 'advanced'): void {
    this.courseForm.patchValue({ level });
  }

  isLevelSelected(level: 'beginner' | 'intermediate' | 'advanced'): boolean {
    return this.courseForm.get('level')?.value === level;
  }

  // Form control getters for easy access in template
  get title() { return this.courseForm.get('title'); }
  get description() { return this.courseForm.get('description'); }
  get duration() { return this.courseForm.get('duration'); }
  get startDate() { return this.courseForm.get('startDate'); }
  get instructor() { return this.courseForm.get('instructor'); }
  get price() { return this.courseForm.get('price'); }
  get level() { return this.courseForm.get('level'); }
}
