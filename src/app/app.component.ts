import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Course } from './core/models/course.model';
import { catchError } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { StorageService } from './core/services/storage.service';
import { Router } from '@angular/router';
import { User } from './core/models/user.model';

gsap.registerPlugin(ScrollToPlugin);

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  courses: Course[] = [];
  errorMessage: string | null = null;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);


  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('en');

    if (isPlatformBrowser(this.platformId)) {
      const lang = this.storageService.getItem('lang') || 'en';
      this.storageService.setItem('lang', lang);
      this.translate.use(lang);
    } else {
      this.translate.use('en');
    }

    const user = this.authService.getCurrentUser();
  if (user) {
    this.authService.updateCurrentUser(user);
  } else {
    this.router.navigate(['/login']);
  }
}


  changeLanguage(lang: string): void {
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.setItem('lang', lang);
    }
  }
}
