import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { User, Course } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Reactive state for current user
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
    private storageService: StorageService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();

    // Subscribe to Firebase auth state changes
    this.fireauth.authState.subscribe(user => {
      if (user) {
        // If user is authenticated, get user data from Firestore
        this.firestore.collection<User>('users').doc(user.uid).valueChanges().pipe(
          map(userData => {
            if (userData) {
              this.currentUserSubject.next(userData);
              this.storageService.setItem('currentUser', JSON.stringify(userData));
            } else {
              this.currentUserSubject.next(null);
              this.storageService.removeItem('currentUser');
            }
          }),
          catchError(error => {
            console.error('Error fetching user data:', error);
            return of(null);
          })
        ).subscribe();
      } else {
        // If not authenticated, clear local state
        this.currentUserSubject.next(null);
        this.storageService.removeItem('currentUser');
      }
    });
  }

  // Accessor for current user value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // User registration
  register(newUser: {
    name: string;
    email: string;
    address: string;
    phone: string;
    password: string;
    gender: 'male' | 'female';
    level?: 'beginner' | 'intermediate' | 'advanced';
  }): Observable<{ success: boolean }> {
    return from(this.fireauth.createUserWithEmailAndPassword(newUser.email, newUser.password)).pipe(
      switchMap(userCredential => {
        const user = userCredential.user;
        if (user) {
          const userData: User = {
            id: user.uid,
            name: newUser.name,
            email: newUser.email,
            address: newUser.address,
            phone: newUser.phone,
            gender: newUser.gender,
            level: newUser.level || 'beginner',
            role: 'user',
            courses: [],
            dob: null
          };
          // Save user data to Firestore
          return from(this.firestore.collection<User>('users').doc(user.uid).set(userData)).pipe(
            map(() => ({ success: true })),
            catchError((error) => {
              console.error('Error saving user data to Firestore:', error);
              return of({ success: false });
            })
          );
        } else {
          return of({ success: false });
        }
      }),
      catchError(error => {
        console.error('Error creating user in Firebase:', error);
        return of({ success: false });
      })
    );
  }

  // User login
  login(email: string, password: string): Observable<{ success: boolean; role?: 'user' | 'admin'; userId?: string }> {
    return from(this.fireauth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap(userCredential => {
        const user = userCredential.user;
        if (user) {
          // Load user data from Firestore after login
          return this.firestore.collection<User>('users').doc(user.uid).valueChanges().pipe(
            map(userData => {
              if (userData) {
                this.storageService.setItem('currentUser', JSON.stringify(userData));
                this.currentUserSubject.next(userData);
                return { success: true, role: userData.role, userId: userData.id };
              }
              return { success: false };
            }),
            catchError(() => of({ success: false }))
          );
        } else {
          return of({ success: false });
        }
      }),
      catchError(err => {
        console.error('Error during login:', err);
        return of({ success: false });
      })
    );
  }

  // Logout the user
  logout(): Observable<void> {
    return from(this.fireauth.signOut()).pipe(
      tap(() => {
        this.storageService.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }),
      catchError(error => {
        console.error('Error during logout:', error);
        return throwError(() => error);
      })
    );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Get user from localStorage
  getCurrentUser(): User | null {
    const userData = this.storageService.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData) as User;
      if (!user.courses) user.courses = [];
      return user;
    }
    return null;
  }

  // Update current user in local state
  updateCurrentUser(updatedUser: User): void {
    if (!updatedUser.courses) updatedUser.courses = [];
    this.storageService.setItem('currentUser', JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
  }

  // Add course to user profile
  addCourseToUser(courseId: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const courseExists = currentUser.courses?.some(c => c.id === courseId);
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

  // Fetch course by ID from Firestore
  private getCourseById(id: string): Observable<Course | undefined> {
    return this.firestore.collection<Course>('courses').doc(id).valueChanges().pipe(
      map(course => course),
      catchError(error => {
        console.error('Error fetching course by ID:', error);
        return of(undefined);
      })
    );
  }

  // Check if current user is admin
  isAdmin(): Observable<boolean> {
    return this.currentUser.pipe(
      map((user: User | null) => user?.role === 'admin')
    );
  }

  // Get role of current user
  getUserRole(): Observable<'user' | 'admin' | null> {
    const role = this.getCurrentUser()?.role;
    return of(role as 'user' | 'admin' | null);
  }

  // Get full user profile by ID
  getUserProfile(userId: string): Observable<User | null> {
    return this.firestore.collection<User>('users').doc(userId).valueChanges().pipe(
      map(user => {
        if (!user) return null;
        if (!user.courses) user.courses = [];
        return user;
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of(null);
      })
    );
  }

  // Update user profile picture
  updateProfilePicture(newProfilePictureUrl: string): Observable<void> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      currentUser.profilePicture = newProfilePictureUrl;
      return from(this.firestore.collection<User>('users').doc(currentUser.id).update({ profilePicture: newProfilePictureUrl })).pipe(
        map(() => {
          this.currentUserSubject.next(currentUser);
          this.storageService.setItem('currentUser', JSON.stringify(currentUser));
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

  // Get all users (only role: user)
  getAllUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users', ref => ref.where('role', '==', 'user')).valueChanges().pipe(
      map(users => {
        return users.map(user => {
          if (!user.courses) user.courses = [];
          return user;
        });
      }),
      catchError(error => {
        console.error('Error fetching all users:', error);
        return of([]);
      })
    );
  }

  // Navigate back to admin dashboard
  navigateBack() {
    this.router.navigate(['/admin-dashboard']);
  }

  // Update user in Firestore
  updateUser(userId: string, userData: Partial<User>): Promise<void> {
    return this.firestore.collection('users').doc(userId).update(userData);
  }

  // Delete user from Firestore
  deleteUser(userId: string): Promise<void> {
    return this.firestore.collection('users').doc(userId).delete();
  }
}
