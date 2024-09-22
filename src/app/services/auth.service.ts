import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from './storage.service';
import { User, Course } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
    private storageService: StorageService
  ) {
    const savedUser = typeof window !== 'undefined' ? storageService.getItem('currentUser') : null;
    console.log('Saved user from storageService:', savedUser); // Add this log

    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();

    // Subscribe to auth state changes
    this.fireauth.authState.subscribe(user => {
      console.log('Auth state changed:', user); // Debugging log
      if (user) {
        // Create User object with proper defaults
        const userData: User = {
          id: user.uid,
          name: '', // Set default or retrieve from somewhere
          email: user.email || '',
          phone: '', // Set default or retrieve from somewhere
          gender: 'male', // Default or handle as needed
          level: 'beginner', // Default or handle as needed
          role: 'user', // Default or adjust as needed
          courses: []
        };
        this.currentUserSubject.next(userData);
        storageService.setItem('currentUser', JSON.stringify(userData));
      } else {
        // If no user, set currentUserSubject to null
        this.currentUserSubject.next(null);
        storageService.removeItem('currentUser');
      }
    });
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Method to retrieve the current user's ID from Firebase Authentication
  async getCurrentUserId(): Promise<string | null> {
    try {
      const user = await this.fireauth.currentUser;
      console.log('Current user:', user); // Add this log
      return user ? user.uid : null;
    } catch (error) {
      console.error('Error fetching current user ID:', error);
      return null;
    }
  }

  register(newUser: { name: string; email: string; phone: string; password: string; gender: 'male' | 'female'; level?: 'beginner' | 'intermediate' | 'advanced' }): Observable<{ success: boolean }> {
    const user: User = {
      id: this.firestore.createId(),
      name: newUser.name || '',
      email: newUser.email || '',
      phone: newUser.phone || '',
      password: newUser.password || '',
      gender: newUser.gender || 'male',
      level: newUser.level || 'beginner',
      role: 'user',
      courses: []
    };

    return from(this.firestore.collection<User>('users').doc(user.id).set(user)).pipe(
      map(() => ({ success: true })),
      catchError(() => of({ success: false }))
    );
  }

  login(email: string, password: string):
  Observable<{ success: boolean; token?: string; role?: 'user' | 'admin'; userId?: string }> {
    return this.firestore.collection<User>
    ('users', ref => ref.where('email', '==', email).where('password', '==', password)).get().pipe(
      map(snapshot => {
        const user = snapshot.docs.map(doc => doc.data()).find(u => u.email === email && u.password === password);
        if (user) {
          const token = 'dummy-token';
          const role: 'user' | 'admin' = (user as User & { role?: 'user' | 'admin' }).role || 'user';
          this.storageService.setItem('userToken', token);
          this.storageService.setItem('role', role);
          this.storageService.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return { success: true, token, role, userId: user.id };
        } else {
          return { success: false };
        }
      }),
      catchError(() => of({ success: false }))
    );
  }

  logout(): void {
    this.storageService.removeItem('userToken');
    this.storageService.removeItem('role');
    this.storageService.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getItem('userToken');
  }

  getCurrentUser(): User | null {
    const userData = this.storageService.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData) as User;
      if (!user.courses) {
        user.courses = [];
      }
      return user;
    }
    return null;
  }

  updateCurrentUser(updatedUser: User): void {
    if (!updatedUser.courses) {
      updatedUser.courses = [];
    }
    this.storageService.setItem('currentUser', JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
  }


  addCourseToUser(courseId: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      if (!currentUser.courses) {
        currentUser.courses = [];
      }
      const courseExists = currentUser.courses.some(c => c.id === courseId);
      if (!courseExists) {
        return this.getCourseById(courseId).pipe(
          map(course => {
            if (course) {
              currentUser.courses!.push(course);
              this.updateCurrentUser(currentUser);
              return { success: true };
            }
            return { success: false };
          }),
          catchError(error => {
            console.error('Error fetching course:', error);
            return of({ success: false });
          })
        );
      } else {
        return of({ success: false });
      }
    } else {
      return of({ success: false });
    }
  }

  private getCourseById(id: string): Observable<Course | undefined> {
    return this.firestore.collection<Course>('courses').doc(id).valueChanges().pipe(
      map(course => course),
      catchError(error => {
        console.error('Error fetching course by ID:', error);
        return of(undefined);
      })
    );
  }

  isAdmin(): Observable<boolean> {
    return this.currentUser.pipe(
      map((user: User | null) => user?.role === 'admin')
    );
  }

  getUserRole(): Observable<'user' | 'admin' | null> {
    return of(this.storageService.getItem('role') as 'user' | 'admin' | null);
  }

  getUserProfile(userId: string): Observable<User | null> {
    return this.firestore.collection<User>('users').doc(userId).valueChanges().pipe(
      map(user => {
        if (!user) {
          return null;
        }
        if (!user.courses) {
          user.courses = [];
        }
        return user;
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of(null);
      })
    );
  }

  updateProfilePicture(newProfilePictureUrl: string): Observable<void> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      currentUser.profilePicture = newProfilePictureUrl;
      console.log('New profile picture URL:', newProfilePictureUrl); // إضافة السجل هنا
      return from(this.firestore.collection<User>('users').doc(currentUser.id).update({ profilePicture: newProfilePictureUrl })).pipe(
        map(() => {
          // تأكد من تحديث المستخدم في الـ BehaviorSubject
          console.log('Updating current user with new profile picture'); // إضافة السجل هنا
          this.currentUserSubject.next(currentUser);
        }),
        catchError(error => {
          console.error('Error updating profile picture:', error);
          return throwError(() => new Error('Error updating profile picture'));
        })
      );
    } else {
      return throwError(() => new Error('No current user found'));
    }
  }


}
