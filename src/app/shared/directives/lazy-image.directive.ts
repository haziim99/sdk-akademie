import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit {
  @Input() appLazyImage!: string;
  @Input() alt = '';
  @Input() sizes = '100vw';
  @Input() srcset = '';

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setupLazyLoading();
  }

  private setupLazyLoading() {
    const img = this.el.nativeElement;
    
    // Set initial attributes
    this.renderer.setAttribute(img, 'alt', this.alt);
    this.renderer.setAttribute(img, 'sizes', this.sizes);
    
    // Add loading="lazy" for native lazy loading
    this.renderer.setAttribute(img, 'loading', 'lazy');
    
    // Set up intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage();
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      observer.observe(img);
    } else {
      // Fallback for older browsers
      this.loadImage();
    }
  }

  private loadImage() {
    const img = this.el.nativeElement;
    
    // Check if WebP is supported
    if (this.supportsWebP()) {
      // Use WebP version if available
      const webpSrc = this.appLazyImage.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      this.renderer.setAttribute(img, 'src', webpSrc);
    } else {
      // Fallback to original format
      this.renderer.setAttribute(img, 'src', this.appLazyImage);
    }
    
    // Set srcset for responsive images if provided
    if (this.srcset) {
      this.renderer.setAttribute(img, 'srcset', this.srcset);
    }
    
    // Add error handling
    img.onerror = () => {
      // Fallback to original image if WebP fails
      if (img.src.includes('.webp')) {
        this.renderer.setAttribute(img, 'src', this.appLazyImage);
      }
    };
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
}