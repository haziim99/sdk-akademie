import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Course } from './services/course.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './services/storage.service';

// تسجيل الإضافة
gsap.registerPlugin(ScrollToPlugin);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  courses: Course[] = [];
  errorMessage: string | null = null;

  constructor(
    private storageService: StorageService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Example in a service or component
    if (typeof window !== 'undefined') {
      const user = storageService.getItem('user');
  // Proceed with using 'user'
  }
  }

  ngOnInit(): void {
    // Set default language
    this.translate.setDefaultLang('en');
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = this.storageService.getItem('user');
      console.log('Saved user:', savedUser);
      const lang = this.storageService.getItem('lang') || 'en';
      this.storageService.setItem('lang', lang);


      this.translate.use(lang);
    } else {
      // If SSR, default to 'en'
      this.translate.use('en');
    }
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    // Use storageService only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.setItem('lang', lang); //
    }
  }

  getUser() {
    return this.storageService.getItem('user');
  }

  setUser(user: string) {
    this.storageService.setItem('user', user);
  }

}
