import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private localStorageAvailable: boolean;
  private memoryStorage: { [key: string]: string } = {}; // Object for memory storage

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
        console.warn('localStorage is not available:', e);
        return false;
      }
    }
    console.warn('Not in a browser environment.');
    return false;
  }

  setItem(key: string, value: string): void {
    if (this.localStorageAvailable) {
      try {
        localStorage.setItem(key, value);
        console.log(`Saved ${key}:`, value);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    } else {
      this.memoryStorage[key] = value;
    }
  }

  getItem(key: string): string | null {
    if (this.localStorageAvailable) {
      try {
        const value = localStorage.getItem(key);
        console.log(`Retrieved ${key}:`, value);
        return value;
      } catch (e) {
        console.error('Error retrieving from localStorage:', e);
        return null;
      }
    }
    return this.memoryStorage[key] || null;
  }

  removeItem(key: string): void {
    if (this.localStorageAvailable) {
      try {
        localStorage.removeItem(key);
        console.log(`Removed ${key} from localStorage`);
      } catch (e) {
        console.error('Error removing from localStorage:', e);
      }
    } else {
      delete this.memoryStorage[key];
    }
  }
}
