import { Injectable } from '@angular/core';
import { Firestore, getFirestore, doc, updateDoc, arrayUnion, collection, addDoc } from '@angular/fire/firestore';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: Firestore;

  constructor() {
    this.db = getFirestore(); // Initialize Firestore
  }

  // Adding a video to a course
  async addVideoToCourse(courseId: string, video: { title: string; url: string }): Promise<void> {
    const courseRef = doc(this.db, "courses", courseId);

    await updateDoc(courseRef, {
      videos: arrayUnion(video)
    });
  }

  // Adding admin to Firebase Firestore
  async addAdmin(user: User): Promise<void> {
    const adminData = {
      ...user,
      role: 'admin',
    };
    const usersCollectionRef = collection(this.db, 'users'); // Use Firestore collection reference
    await addDoc(usersCollectionRef, adminData); // Add admin document to 'users' collection
  }
}
