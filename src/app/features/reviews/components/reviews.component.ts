import { Component, AfterViewInit } from '@angular/core';
import Splide from '@splidejs/splide';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements AfterViewInit {
  comments = [
    { text: "Very wonderful course", author: "Ahmed Mohamed" },
    { text: "It's very good", author: "Sarah Hassan" },
    { text: "I liked it", author: "Tarek Sobhy" },
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
