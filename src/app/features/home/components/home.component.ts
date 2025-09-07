import { Component, ElementRef, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // Initialize any data if needed
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimations();
    }
  }

  private initializeAnimations(): void {
    // Hero Section Animations
    this.animateHeroSection();

    // Scroll-based animations
    this.animateOnScroll();

    // Services hover animations
    this.setupServiceHoverEffects();
  }

  private animateHeroSection(): void {
    const tl = gsap.timeline();

    // Hero text with typewriter effect
    const heroText = this.el.nativeElement.querySelector('.hero-text');
    const heroSubtext = this.el.nativeElement.querySelector('.hero-subtext');
    const heroButton = this.el.nativeElement.querySelector('.styled-button');

    if (heroText) {
      // Animate each letter of SDK with different colors
      const sdkSpans = heroText.querySelectorAll('.highlight span');

      tl.fromTo(heroText,
        { opacity: 0, y: -100, rotation: -5 },
        { opacity: 1, y: 0, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' }
      )
      .fromTo(sdkSpans,
        { scale: 0, rotation: 180 },
        { scale: 1, rotation: 0, duration: 0.8, stagger: 0.2, ease: 'elastic.out(1, 0.5)' },
        '-=0.5'
      );
    }

    if (heroSubtext) {
      tl.fromTo(heroSubtext,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (heroButton) {
      tl.fromTo(heroButton,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out' },
        '-=0.2'
      );
    }
  }

  private animateOnScroll(): void {
    // Why SDK Section - Advanced Scroll Effects
    const whySdkItems = this.el.nativeElement.querySelectorAll('.why-sdk-item');
    if (whySdkItems.length) {
      whySdkItems.forEach((item: Element, index: number) => {
        const image = item.querySelector('.why-sdk-image');
        const textContent = item.querySelector('.text-content');

        // Main timeline with scrub
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'bottom 30%',
            scrub: 1,
            toggleActions: 'play none none reverse'
          }
        });

        // Alternating slide directions
        const fromX = index % 2 === 0 ? -150 : 150;

        tl.fromTo(item,
          { opacity: 0, x: fromX, scale: 0.8 },
          { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out' }
        );

        // Image parallax effect
        if (image) {
          gsap.fromTo(image,
            { scale: 1.2, rotation: index % 2 === 0 ? -5 : 5 },
            {
              scale: 1,
              rotation: 0,
              duration: 5,
              scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                end: 'bottom 20%',
                scrub: 2
              }
            }
          );
        }

        // Text reveal effect
        if (textContent) {
          const heading = textContent.querySelector('h3');
          const paragraph = textContent.querySelector('p');

          if (heading) {
            gsap.fromTo(heading,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                scrollTrigger: {
                  trigger: heading,
                  start: 'top 90%',
                  end: 'bottom 60%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }

          if (paragraph) {
            gsap.fromTo(paragraph,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: 0.2,
                scrollTrigger: {
                  trigger: paragraph,
                  start: 'top 95%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
        }
      });
    }

    // Services Section
    const serviceItems = this.el.nativeElement.querySelectorAll('.services-item');
    if (serviceItems.length) {
      gsap.fromTo(serviceItems,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.our-services',
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Reviews section
    const reviewsHeader = this.el.nativeElement.querySelector('.students-reviews-header h2');
    if (reviewsHeader) {
      gsap.fromTo(reviewsHeader,
        { opacity: 0, rotationX: 90 },
        {
          opacity: 1,
          rotationX: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.students-reviews-header',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  private setupServiceHoverEffects(): void {
    const serviceItems = this.el.nativeElement.querySelectorAll('.services-item');

    serviceItems.forEach((item: Element) => {
      const image = item.querySelector('.service-image');
      const textContent = item.querySelector('.text-content');

      item.addEventListener('mouseenter', () => {
        gsap.to(item, { scale: 1.08, duration: 0.3, ease: 'power2.out' });
        gsap.to(image, { scale: 1.1, rotation: 2, duration: 0.3 });
        gsap.to(textContent, { y: -5, duration: 0.3 });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, { scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(image, { scale: 1, rotation: 0, duration: 0.3 });
        gsap.to(textContent, { y: 0, duration: 0.3 });
      });
    });
  }

  // Enhanced navigation with smooth scroll animation
  navigateToCourses(): void {
    // Add button click animation
    const button = this.el.nativeElement.querySelector('.styled-button');
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          this.router.navigate(['/courses']).catch(err => console.error(err));
        }
      });
    } else {
      this.router.navigate(['/courses']).catch(err => console.error(err));
    }
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
