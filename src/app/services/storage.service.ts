import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private localStorageAvailable: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.localStorageAvailable = this.checkLocalStorageAvailability();
  }

  private checkLocalStorageAvailability(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const testKey = 'test';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        console.warn('localStorage is not available.');
        return false;
      }
    } else {
      console.warn('Not in a browser environment.');
      return false;
    }
  }

  setItem(key: string, value: string): void {
    if (this.localStorageAvailable) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  }

  getItem(key: string): string | null {
    if (this.localStorageAvailable) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('Error retrieving from localStorage:', e);
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.localStorageAvailable) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Error removing from localStorage:', e);
      }
    }
  }
}
