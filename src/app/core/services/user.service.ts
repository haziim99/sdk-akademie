import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, Course } from '../models/user.model';
import { Lecture, CourseLectures } from '../models/course.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private coursesUrl = 'http://localhost:3000/courses';
  private lecturesUrl = 'assets/data/course-lectures.json';
  private userCollection: AngularFirestoreCollection<User>;
  private availableCoursesCache: Course[] | null = null;

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private storageService: StorageService //  StorageService
  ) {
    this.userCollection = this.firestore.collection('users');
  }

  private getCurrentUser(): User | null {
    const user = this.storageService.getItem('currentUser'); //  this.storageService
    return user ? JSON.parse(user) : null;
  }

  private saveUserToStorageService(user: User): void { //
    this.storageService.setItem('currentUser', JSON.stringify(user)); // this.storageService
  }

  getUserCourses(userId: string): Observable<Course[]> {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      return of(currentUser.courses ?? []);
    }
    return of([]);
  }

  updateUser(userId: string, updatedData: Partial<User>): Observable<{ success: boolean }> {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updatedData };
      this.saveUserToStorageService(updatedUser); // استخدام الدالة المعدلة
      return of({ success: true });
    }
    return of({ success: false });
  }

  buyCourse(userId: string, courseId: string): Observable<{ success: boolean }> {
    return this.getAvailableCourses().pipe(
      map(courses => {
        const course = courses.find(c => c.id === courseId);
        const currentUser = this.getCurrentUser();
        if (course && currentUser && currentUser.id === userId) {
          if (!currentUser.courses) {
            currentUser.courses = [];
          }
          if (!currentUser.courses.some(c => c.id === courseId)) {
            currentUser.courses.push(course);
            this.saveUserToStorageService(currentUser);

            // Update the availableCoursesCache
            this.availableCoursesCache = this.availableCoursesCache?.filter(c => c.id !== courseId) || [];
            return { success: true };
          }
        }
        return { success: false };
      }),
      catchError(error => {
        console.error('Error occurred while purchasing the course:', error);
        return of({ success: false });
      })
    );
  }

  getAvailableCourses(): Observable<Course[]> {
    if (this.availableCoursesCache) {
      return of(this.availableCoursesCache);
    }

    return this.http.get<Course[]>(this.coursesUrl).pipe(
      map(courses => {
        const currentUser = this.getCurrentUser();
        const filteredCourses = courses.filter(course => !currentUser?.courses?.some(c => c.id === course.id));
        this.availableCoursesCache = filteredCourses;
        return filteredCourses;
      }),
      catchError(error => {
        console.error('Error occurred while fetching available courses:', error);
        return of([]);
      })
    );
  }

  removeCourseFromUser(courseId: string): Observable<{ success: boolean }> {
    return this.getUserCourses(this.getCurrentUser()?.id ?? '').pipe(
      map(userCourses => {
        const updatedCourses = userCourses.filter(course => course.id !== courseId);
        const currentUser = this.getCurrentUser();

        if (currentUser) {
          currentUser.courses = updatedCourses;
          this.saveUserToStorageService(currentUser);

          // Add the removed course back to available courses
          const removedCourse = userCourses.find(course => course.id === courseId);
          if (removedCourse) {
            this.availableCoursesCache = [...(this.availableCoursesCache || []), removedCourse];
          }

          return { success: true };
        }
        return { success: false };
      }),
      catchError(error => {
        console.error('Error occurred while removing the course:', error);
        return of({ success: false });
      })
    );
  }

  getCourseLectures(courseId: string): Observable<Lecture[]> {
    return this.http.get<{ [key: string]: CourseLectures }>(this.lecturesUrl).pipe(
      map(data => {
        const courseLectures = data[courseId];
        return courseLectures?.lectures || [];
      }),
      catchError(error => {
        console.error('Error occurred while fetching course lectures:', error);
        return of([]);
      })
    );
  }

  // New method to get user gender
  getUserGender(userId: string): Observable<'male' | 'female' | null> {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      return of(currentUser.gender);
    }
    return of(null);
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await firstValueFrom(this.userCollection.doc(userId).get());
      return userDoc.data() || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async updateProfilePicture(userId: string, profilePictureUrl: string): Promise<void> {
    try {
      await this.userCollection.doc(userId).update({ profilePicture: profilePictureUrl });
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  }
}
