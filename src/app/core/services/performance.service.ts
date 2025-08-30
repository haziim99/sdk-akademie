import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor() { }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals(): Observable<PerformanceMetrics> {
    return new Observable(observer => {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        observer.next({ lcp } as PerformanceMetrics);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP not supported');
      }

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const fid = entry.processingStart - entry.startTime;
          observer.next({ fid } as PerformanceMetrics);
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID not supported');
      }

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
            observer.next({ cls: clsValue } as PerformanceMetrics);
          }
        }
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS not supported');
      }

      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcp = entries[0].startTime;
        observer.next({ fcp } as PerformanceMetrics);
      });
      
      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP not supported');
      }

      // TTFB (Time to First Byte)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        observer.next({ ttfb } as PerformanceMetrics);
      }

      // FMP (First Meaningful Paint) - approximate
      const fmpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fmp = entries[0].startTime;
        observer.next({ fmp } as PerformanceMetrics);
      });
      
      try {
        fmpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FMP not supported');
      }
    });
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics(): PerformanceMetrics {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      lcp: 0, // Will be updated by observer
      fid: 0, // Will be updated by observer
      cls: 0, // Will be updated by observer
      fcp: 0, // Will be updated by observer
      ttfb: navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : 0,
      fmp: 0 // Will be updated by observer
    };
  }

  /**
   * Log performance metrics to console
   */
  logMetrics(metrics: PerformanceMetrics): void {
    console.group('🚀 Performance Metrics');
    console.log(`LCP: ${metrics.lcp.toFixed(2)}ms`);
    console.log(`FID: ${metrics.fid.toFixed(2)}ms`);
    console.log(`CLS: ${metrics.cls.toFixed(3)}`);
    console.log(`FCP: ${metrics.fcp.toFixed(2)}ms`);
    console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`);
    console.log(`FMP: ${metrics.fmp.toFixed(2)}ms`);
    console.groupEnd();
  }

  /**
   * Send metrics to analytics (Google Analytics, etc.)
   */
  sendToAnalytics(metrics: PerformanceMetrics): void {
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance', {
        event_category: 'Core Web Vitals',
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        fcp: metrics.fcp,
        ttfb: metrics.ttfb,
        fmp: metrics.fmp
      });
    }
  }

  /**
   * Check if metrics meet Core Web Vitals thresholds
   */
  meetsCoreWebVitals(metrics: PerformanceMetrics): boolean {
    return (
      metrics.lcp <= 2500 && // Good: ≤ 2.5s
      metrics.fid <= 100 &&   // Good: ≤ 100ms
      metrics.cls <= 0.1      // Good: ≤ 0.1
    );
  }
}