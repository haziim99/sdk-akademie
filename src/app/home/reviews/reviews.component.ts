import { Component, AfterViewInit } from '@angular/core';
import Splide from '@splidejs/splide';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements AfterViewInit {
  comments = [
    { text: "Very wonderful course", author: "John Doe" },
    { text: "It's very good", author: "Jane Smith" },
    { text: "I liked it", author: "Alice Johnson" },
    // يمكنك إضافة المزيد من التعليقات هنا
  ];

  ngAfterViewInit(): void {
    const splide = new Splide('.splide', {
      type: 'loop',
      perPage: 1,
      autoplay: true,
      interval: 2000,
      arrows: false,
      pagination: false,
      speed: 1000
    }).mount();
  }
}
