import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CoursesService } from '@/app/core/services/courses.service';
import { UserService } from '@/app/core/services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

Chart.register(...registerables);

@Component({
  selector: 'app-stats-overview',
  template: `
    <div class="stats-overview">
      <h2>Statistics Overview</h2>
      <div class="stat-items">
        <div class="stat-item">
          <i class="fas fa-book-open"></i>
          <h3>Total Courses</h3>
          <p>{{ totalCourses }}</p>
        </div>
        <div class="stat-item">
          <i class="fas fa-user-graduate"></i>
          <h3>Total Students</h3>
          <p>{{ totalStudents }}</p>
        </div>
        <div class="stat-item">
          <i class="fas fa-star"></i>
          <h3>Total Revenue</h3>
          <p>\${{ totalRevenue | number:'1.0-0' }}</p>
        </div>
      </div>
      <canvas id="myChart" width="400" height="100"></canvas>
    </div>
  `,
  styleUrls: ['./stats-overview.component.scss'],
  standalone: false
})
export class StatsOverviewComponent implements OnInit, AfterViewInit {
  totalCourses = 0;
  totalStudents = 0;
  totalRevenue = 0;
  chart: any;

  constructor(
    private coursesService: CoursesService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.loadStatistics();
  }

  ngAfterViewInit() {
    setTimeout(() => this.createChart(), 100);
  }

  private loadStatistics() {
    // Get courses count
    this.coursesService.getCourses().subscribe(courses => {
      this.totalCourses = courses.length;
      this.calculateRevenue(courses);
      this.updateChart();
    });

    // Get students count
    this.firestore.collection('users', ref => ref.where('role', '==', 'user'))
      .valueChanges().subscribe(users => {
        this.totalStudents = users.length;
        this.updateChart();
      });
  }

  private calculateRevenue(courses: any[]) {
    this.totalRevenue = courses.reduce((total, course) => total + (course.price || 0), 0);
  }

  private createChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Courses', 'Students', 'Revenue ($)'],
        datasets: [{
          data: [this.totalCourses, this.totalStudents, this.totalRevenue / 100],
          backgroundColor: [
            'rgba(255, 110, 97, 0.8)',
            'rgba(213, 180, 255, 0.8)',
            'rgba(54, 162, 235, 0.8)'
          ],
          borderColor: [
            '#ff6e61',
            '#d5b4ff',
            '#36A2EB'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                family: 'Titillium Web',
                size: 14
              }
            }
          }
        }
      }
    });
  }

  private updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.totalCourses,
        this.totalStudents,
        this.totalRevenue / 100
      ];
      this.chart.update();
    }
  }
}
