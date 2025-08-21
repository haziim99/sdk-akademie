// support-response.model.ts
import firebase from 'firebase/compat/app';
import { Timestamp } from 'firebase/firestore';

export interface SupportResponse {
  author: string;
  message: string;
  date: Timestamp;
  title: string;

}

export interface SupportTicket {
  id?: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  responses: SupportResponse[];
  createdAt: Timestamp;
  userId: string;
  lastUpdated: Timestamp;
  title: string;
}
