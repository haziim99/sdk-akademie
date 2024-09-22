import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  images = [
    'assets/images/review1.jpg',
    'assets/images/review2.jpg',
    'assets/images/review3.jpg'
    ];
}
