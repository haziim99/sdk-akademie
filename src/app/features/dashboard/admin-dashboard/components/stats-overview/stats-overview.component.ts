import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // تسجيل جميع المكونات

@Component({
    selector: 'app-stats-overview',
    templateUrl: './stats-overview.component.html',
    styleUrls: ['./stats-overview.component.scss'],
    standalone: false
})
export class StatsOverviewComponent implements AfterViewInit {
  totalCourses = 50;
  totalStudents = 200;
  totalReviews = 150;

  chart: any;

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('myChart', {
      type: 'bar', // نوع الرسم البياني
      data: {
        labels: ['Courses', 'Students', 'Reviews'],
        datasets: [{
          label: 'Total',
          data: [this.totalCourses, this.totalStudents, this.totalReviews],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
