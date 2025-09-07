import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Instructor } from '@/app/core/models/course.model';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent implements OnInit, AfterViewInit {

  // Instructor data with enhanced properties
  instructors: Instructor[] = [
    {
      name: 'Dr. Anna Müller',
      picture: 'assets/images/instructor1.png',
      position: 'Senior German Language Instructor',
      bio: 'Dr. Anna Müller has over 15 years of experience in teaching German. She specializes in advanced grammar and conversation practice with a focus on immersive learning techniques.',
      specialties: ['Advanced Grammar', 'Conversation Practice', 'Business German']
    },
    {
      name: 'Mr. Michael Schmidt',
      picture: 'assets/images/instructor2.jpg',
      position: 'German Language Tutor',
      bio: 'Mr. Michael Schmidt is an experienced tutor with a passion for helping students achieve their language goals through innovative teaching methods and cultural immersion.',
      specialties: ['Cultural Immersion', 'Beginner Courses', 'Exam Preparation']
    },
    {
      name: 'Ms. Lisa Weber',
      picture: 'assets/images/instructor3.png',
      position: 'German Conversation Specialist',
      bio: 'Ms. Lisa Weber specializes in conversation practice and phonetics. She helps students improve their speaking skills through dynamic and interactive sessions.',
      specialties: ['Phonetics', 'Speaking Skills', 'Interactive Learning']
    },
    {
      name: 'Dr. Hans Becker',
      picture: 'assets/images/instructor4.png',
      position: 'German Literature Expert',
      bio: 'Dr. Hans Becker brings extensive knowledge of German literature and cultural studies, providing students with comprehensive understanding of language and culture.',
      specialties: ['Literature', 'Cultural Studies', 'Academic Writing']
    }
  ];

  // Animation states
  isVisible = false;
  currentInstructorIndex = 0;

  ngOnInit(): void {
    this.setupAnimationTriggers();
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();

    this.initializeGSAPAnimations();
  }

  /**
   * Setup animation triggers for component elements
   */
  private setupAnimationTriggers(): void {
    setTimeout(() => {
      this.isVisible = true;
    }, 500);
  }

  /**
   * Setup scroll-based animations using Intersection Observer
   */
  private setupScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Initialize GSAP animations if library is available
   */
  private initializeGSAPAnimations(): void {
    if (typeof window !== 'undefined' && (window as any).gsap) {
      const gsap = (window as any).gsap;

      gsap.from('.about-banner', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        stagger: 0.3,
        ease: 'power2.out'
      });

      gsap.from('.instructor-card', {
        duration: 1,
        x: (index: number) => index % 2 === 0 ? -100 : 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.instructors',
          start: 'top 80%'
        }
      });
    }
  }

  /**
   * Handle instructor card hover effects
   */
  onInstructorHover(index: number): void {
    this.currentInstructorIndex = index;
  }

  /**
   * Handle specialty tag animations
   */
  onSpecialtyClick(specialty: string): void {
    // Add specialty highlight animation
    console.log(`Specialty clicked: ${specialty}`);
  }

  /**
   * Scroll to specific section with smooth animation
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Get animation delay for staggered animations
   */
  getAnimationDelay(index: number): string {
    return `${index * 0.2}s`;
  }

  /**
   * Check if element should show animation
   */
  shouldAnimate(index: number): boolean {
    return this.isVisible && index <= this.currentInstructorIndex + 1;
  }
}
