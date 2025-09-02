import { Component, ElementRef, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Import AuthService
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

gsap.registerPlugin(ScrollToPlugin);

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private el: ElementRef,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {
    // Set default language
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const tl = gsap.timeline();

      const heroText = this.el.nativeElement.querySelector('.hero-text');
      const heroSubtext = this.el.nativeElement.querySelector('.hero-subtext');

      if (heroText && heroSubtext) {
        tl.fromTo(heroText,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        ).fromTo(heroSubtext,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 }
        );
      }

      const whySdkItems = this.el.nativeElement.querySelectorAll('.why-sdk-item');
      if (whySdkItems.length) {
        gsap.fromTo(whySdkItems,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.2, delay: .5 }
        );
      }

      const courses = this.el.nativeElement.querySelectorAll('.course');
      if (courses.length) {
        gsap.fromTo(courses,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.2, delay: 2 }
        );
      }
    }
  }

  navigateToCourses(): void {
    this.router.navigate(['/courses']).catch(err => console.error(err));
  }

  onLogin(email: string, password: string): void {
  this.authService.login(email, password).subscribe({
    next: (res) => {
      if (res.success) {
        this.router.navigate(['/user/profile']);
      } else {
        console.error('Login failed');
      }
    },
    error: (err) => {
      console.error('Error logging in:', err);
    }
  });
}
}
