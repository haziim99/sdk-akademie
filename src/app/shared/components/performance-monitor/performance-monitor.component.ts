import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceService, PerformanceMetrics } from '@/app/core/services/performance.service';
import { Subscription } from 'rxjs';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-performance-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="performance-monitor" *ngIf="showMonitor">
      <div class="metrics-grid">
        <div class="metric" [class.good]="isGoodMetric('lcp')" [class.poor]="isPoorMetric('lcp')">
          <span class="label">LCP</span>
          <span class="value">{{ metrics.lcp | number:'1.0-0' }}ms</span>
        </div>
        <div class="metric" [class.good]="isGoodMetric('fid')" [class.poor]="isPoorMetric('fid')">
          <span class="label">FID</span>
          <span class="value">{{ metrics.fid | number:'1.0-0' }}ms</span>
        </div>
        <div class="metric" [class.good]="isGoodMetric('cls')" [class.poor]="isPoorMetric('cls')">
          <span class="label">CLS</span>
          <span class="value">{{ metrics.cls | number:'1.0-3' }}</span>
        </div>
        <div class="metric" [class.good]="isGoodMetric('fcp')" [class.poor]="isPoorMetric('fcp')">
          <span class="label">FCP</span>
          <span class="value">{{ metrics.fcp | number:'1.0-0' }}ms</span>
        </div>
        <div class="metric" [class.good]="isGoodMetric('ttfb')" [class.poor]="isPoorMetric('ttfb')">
          <span class="label">TTFB</span>
          <span class="value">{{ metrics.ttfb | number:'1.0-0' }}ms</span>
        </div>
      </div>
      
      <div class="overall-score" [class.good]="overallScore === 'good'" [class.needs-improvement]="overallScore === 'needs-improvement'" [class.poor]="overallScore === 'poor'">
        {{ overallScore | titlecase }}
      </div>
      
      <button class="toggle-btn" (click)="toggleMonitor()">
        {{ showMonitor ? 'Hide' : 'Show' }} Metrics
      </button>
    </div>
  `,
  styles: [`
    .performance-monitor {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      min-width: 200px;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }
    
    .metric {
      display: flex;
      justify-content: space-between;
      padding: 4px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .metric.good {
      background: rgba(76, 175, 80, 0.3);
      border: 1px solid #4caf50;
    }
    
    .metric.poor {
      background: rgba(244, 67, 54, 0.3);
      border: 1px solid #f44336;
    }
    
    .label {
      font-weight: bold;
    }
    
    .value {
      color: #ffd700;
    }
    
    .overall-score {
      text-align: center;
      padding: 8px;
      margin: 10px 0;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .overall-score.good {
      background: rgba(76, 175, 80, 0.3);
      color: #4caf50;
    }
    
    .overall-score.needs-improvement {
      background: rgba(255, 152, 0, 0.3);
      color: #ff9800;
    }
    
    .overall-score.poor {
      background: rgba(244, 67, 54, 0.3);
      color: #f44336;
    }
    
    .toggle-btn {
      width: 100%;
      padding: 8px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
    }
    
    .toggle-btn:hover {
      background: #1976d2;
    }
  `]
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy {
  metrics: PerformanceMetrics = {
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    fmp: 0
  };
  
  showMonitor = false;
  private subscription: Subscription = new Subscription();

  constructor(private performanceService: PerformanceService) {}

  ngOnInit() {
    // Only show in development mode
    this.showMonitor = !environment.production;
    
    if (this.showMonitor) {
      this.subscription = this.performanceService.monitorCoreWebVitals()
        .subscribe(metrics => {
          this.metrics = { ...this.metrics, ...metrics };
        });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMonitor() {
    this.showMonitor = !this.showMonitor;
  }

  isGoodMetric(metric: keyof PerformanceMetrics): boolean {
    const value = this.metrics[metric];
    switch (metric) {
      case 'lcp': return value <= 2500;
      case 'fid': return value <= 100;
      case 'cls': return value <= 0.1;
      case 'fcp': return value <= 1800;
      case 'ttfb': return value <= 800;
      default: return false;
    }
  }

  isPoorMetric(metric: keyof PerformanceMetrics): boolean {
    const value = this.metrics[metric];
    switch (metric) {
      case 'lcp': return value > 4000;
      case 'fid': return value > 300;
      case 'cls': return value > 0.25;
      case 'fcp': return value > 3000;
      case 'ttfb': return value > 1800;
      default: return false;
    }
  }

  get overallScore(): string {
    const goodCount = ['lcp', 'fid', 'cls'].filter(metric => this.isGoodMetric(metric as keyof PerformanceMetrics)).length;
    const poorCount = ['lcp', 'fid', 'cls'].filter(metric => this.isPoorMetric(metric as keyof PerformanceMetrics)).length;
    
    if (goodCount === 3) return 'good';
    if (poorCount >= 1) return 'poor';
    return 'needs-improvement';
  }
}