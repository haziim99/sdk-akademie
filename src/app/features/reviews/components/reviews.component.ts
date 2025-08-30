import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Splide from '@splidejs/splide';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss'],
    standalone: false
})
export class ReviewsComponent implements AfterViewInit {
  comments = [
    { text: "Very wonderful course", author: "Ahmed Mohamed" },
    { text: "It's very good", author: "Sarah Hassan" },
    { text: "I liked it", author: "Tarek Sobhy" },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
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
}
