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
    // إزالة الوصول إلى مفتاح 'user' إذا لم يكن ضروريًا
  }

  ngOnInit(): void {
    // تعيين اللغة الافتراضية
    this.translate.setDefaultLang('en');
    if (isPlatformBrowser(this.platformId)) {
      const lang = this.storageService.getItem('lang') || 'en';
      this.storageService.setItem('lang', lang);
      this.translate.use(lang);
    } else {
      // إذا كان SSR، استخدم 'en' بشكل افتراضي
      this.translate.use('en');
    }
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    // استخدم storageService فقط في المتصفح
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.setItem('lang', lang);
    }
  }

  // إزالة دوال getUser و setUser إذا لم يعد هناك حاجة لمفتاح 'user'
}
