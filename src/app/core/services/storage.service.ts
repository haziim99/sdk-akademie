import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private localStorageAvailable: boolean;
  private inMemoryStorage: { [key: string]: string } = {}; // Object for in-memory storage

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

  setItem(key: string, value: any): void {
    const stringValue = JSON.stringify(value);
    if (this.localStorageAvailable) {
      try {
        localStorage.setItem(key, stringValue);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    } else {
      this.inMemoryStorage[key] = stringValue;
    }
  }

  getItem(key: string): any | null {
    if (this.localStorageAvailable) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (e) {
        console.error('Error retrieving from localStorage:', e);
        return null;
      }
    }
    return this.inMemoryStorage[key] ? JSON.parse(this.inMemoryStorage[key]) : null;
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
      delete this.inMemoryStorage[key];
    }
  }
}
