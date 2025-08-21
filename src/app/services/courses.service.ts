import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { StorageService } from './storage.service';
import { Course } from './models/course.model';
import { Video } from './models/user.model'; // تأكد من أن Video موجود هنا حسب الحاجة

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private coursesCollection: AngularFirestoreCollection<Course>;
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private storageService: StorageService // Corrected spelling here
  ) {
    this.coursesCollection = this.firestore.collection<Course>('courses');
    this.loadCourses();
  }

  public loadCourses(): void {
    this.coursesCollection.valueChanges().pipe(
      catchError(error => {
        console.error('Error fetching courses', error);
        return of([]);
      })
    ).subscribe((courses: Course[]) => {
      this.coursesSubject.next(courses);
      this.updateStorageService(courses);
    });
  }

  private updateStorageService(courses: Course[]): void {
    this.storageService.setItem('currentCourses', JSON.stringify(courses));
  }

  getCourses(): Observable<Course[]> {
    return this.firestore.collection<Course>('courses').valueChanges().pipe(
        tap(courses => console.log('Courses fetched from Firestore:', courses))
    );
}


  getCourseById(courseId: string): Observable<Course | undefined> {
    return this.firestore.collection<Course>('courses').doc<Course>(courseId).valueChanges().pipe(
      tap(course => console.log('Fetched course:', course)) // سجل الدورة المستردة
    );
  }

  addCourse(course: Course): Observable<void> {
    return new Observable(observer => {
      // Check if course already exists
      if (course.id) {
        observer.error('Course ID should not be provided for new courses');
        return;
      }
      this.coursesCollection.add(course).then(docRef => {
        // Set the new ID on the course
        course.id = docRef.id;
        this.updateCourse(course).subscribe(() => {
          this.loadCourses(); // Reload courses
          observer.next();
          observer.complete();
        });
      }).catch(error => {
        console.error('Error adding course:', error);
        observer.error(error);
      });
    });
  }

  updateCourse(course: Course): Observable<void> {
    return new Observable(observer => {
      if (!course.id) {
        observer.error('Course ID is missing');
        return;
      }

      if (course.startDate) {
        const formattedDate = new Date(course.startDate).toISOString().split('T')[0];
        course.startDate = formattedDate;
      }

      const courseDoc = this.firestore.doc<Course>(`courses/${course.id}`);

      courseDoc.update(course).then(() => {
        this.loadCourses(); // Reload courses
        observer.next();
        observer.complete();
      }).catch(error => {
        console.error('Error updating course:', error);
        observer.error(error);
      });
    });
  }

  deleteCourse(id: string): Observable<void> {
    return new Observable(observer => {
      const courseDoc = this.firestore.doc<Course>(`courses/${id}`);
      courseDoc.delete().then(() => {
        this.loadCourses(); // Reload courses
        observer.next();
        observer.complete();
      }).catch(error => {
        console.error('Error deleting course:', error);
        observer.error(error);
      });
    });
  }

  updateVideo(courseId: string, videoIndex: number, updatedVideo: Video): void {
    const courseDoc = this.firestore.collection<Course>('courses').doc(courseId);

    courseDoc.update({
      [`videos.${videoIndex}`]: updatedVideo
    }).then(() => {
      console.log('Video updated successfully');
    }).catch((error: any) => { // استخدم any للتعامل مع الأخطاء
      console.error('Error updating video:', error.message);
    });
  }
}
