import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Timestamp } from 'firebase/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SupportTicket {
  id?: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  responses: SupportResponse[];
  createdAt: firebase.firestore.Timestamp;
  lastUpdated: firebase.firestore.Timestamp;
}

export interface NewSupportTicket {
  subject: string;
  description: string;
  status: 'open' | 'closed';
  responses: SupportResponse[];
}

export interface SupportResponse {
  author: string;
  message: string;
  date: firebase.firestore.Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private ticketsCollection: AngularFirestoreCollection<SupportTicket>;

  constructor(private firestore: AngularFirestore) {
    this.ticketsCollection = this.firestore.collection<SupportTicket>('supportTickets', ref => ref.orderBy('createdAt', 'desc'));
  }

  // Fetch tickets for a specific user
  getUserTickets(userId: string): Observable<SupportTicket[]> {
    return this.firestore.collection<SupportTicket>('supportTickets', ref =>
      ref.where('userId', '==', userId).orderBy('createdAt', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as SupportTicket;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  // Submit a new ticket
  submitTicket(ticket: SupportTicket): Promise<void> {
    const id = this.firestore.createId();
    return this.ticketsCollection.doc(id).set({
      ...ticket,
      createdAt: firebase.firestore.Timestamp.now(),
      lastUpdated: firebase.firestore.Timestamp.now(),
    });
  }

  // Update ticket (e.g., add response, change status)
  updateTicket(ticketId: string, data: Partial<SupportTicket>): Promise<void> {
    return this.ticketsCollection.doc(ticketId).update({
      ...data,
      lastUpdated: firebase.firestore.Timestamp.now(),
    });
  }

  // Fetch all tickets (Admin)
  getAllTickets(): Observable<SupportTicket[]> {
    return this.ticketsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as SupportTicket;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
