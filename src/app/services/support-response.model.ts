// support-response.model.ts
import firebase from 'firebase/compat/app';
import { Timestamp } from 'firebase/firestore';

export interface SupportResponse {
  author: string;  // اسم الشخص الذي قام بإرسال الرد
  message: string; // نص الرد
  date: Timestamp; // تاريخ ووقت الرد
  title: string;          // Make sure this line exists

}

export interface SupportTicket {
  id?: string; // معرف التذكرة (اختياري عند الإنشاء)
  subject: string; // موضوع التذكرة
  description: string; // وصف التذكرة
  status: 'open' | 'closed'; // حالة التذكرة
  responses: SupportResponse[]; // مصفوفة من ردود الإداريين (مطلوبة)
  createdAt: Timestamp; // تاريخ إنشاء التذكرة
  userId: string; // معرف المستخدم (مطلوب)
  lastUpdated: Timestamp; // تاريخ آخر تحديث (مطلوب)
  title: string;
}
