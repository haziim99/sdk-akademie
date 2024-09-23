import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

export interface Settings {
  academyName: string;
  academyEmail: string;
  selectedPaymentOption: string;
  notificationEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsDoc: AngularFirestoreDocument<Settings>;

  constructor(private firestore: AngularFirestore) {
    this.settingsDoc = this.firestore.doc<Settings>('systemSettings/1'); // استخدم معرف الوثيقة المناسبة
  }

  // جلب الإعدادات
  async getSettings(): Promise<Settings> {
    const doc = await firstValueFrom(this.settingsDoc.get());
    if (doc.exists) {
      return doc.data() as Settings;
    } else {
      throw new Error('No such document!');
    }
  }

  // تحديث الإعدادات
  updateSettings(settings: Settings): Promise<void> {
    return this.settingsDoc.update(settings);
  }

  // جلب خيارات الدفع (يمكنك تعديل هذه لتكون ديناميكية)
  getPaymentOptions(): Promise<string[]> {
    return Promise.resolve(['PayPal', 'Credit Card', 'Bank Transfer']);
  }
}
