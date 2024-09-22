import { Injectable } from '@angular/core';
import { Firestore, getFirestore, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: Firestore;

  constructor() {
    this.db = getFirestore(); // Initialize Firestore
  }

  async addVideoToCourse(courseId: string, video: { title: string; url: string }): Promise<void> {
    const courseRef = doc(this.db, "courses", courseId);

    await updateDoc(courseRef, {
      videos: arrayUnion(video)
    });
  }
}
