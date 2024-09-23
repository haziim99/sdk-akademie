// support.service.ts

import { Injectable } from '@angular/core';
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
  createdAt: Date;
  lastUpdated: Date;
}

export interface NewSupportTicket {
  subject: string;
  description: string;
  status: 'open' | 'closed'; // Include the status property
  responses: SupportResponse[];
}

export interface SupportResponse {
  author: string;
  message: string;
  date: Date;
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
      createdAt: new Date(),
      lastUpdated: new Date(),
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

  // Update ticket (e.g., add response, change status)
  updateTicket(ticketId: string, data: Partial<SupportTicket>): Promise<void> {
    return this.ticketsCollection.doc(ticketId).update({
      ...data,
      lastUpdated: new Date(),
    });
  }
}
