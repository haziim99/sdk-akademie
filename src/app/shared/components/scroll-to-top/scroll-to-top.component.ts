import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
})
export class ScrollToTopComponent {
  showScrollToTopButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollToTopButton = window.scrollY > 300; // إظهار السهم عند التمرير لأسفل 300 بكسل
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // جعل الحركة سلسة
    });
  }
}
