import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ScrollRevealDirective } from '../../../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-services',
  imports: [ScrollRevealDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements AfterViewInit {
  @ViewChild('carousel') carouselRef!: ElementRef<HTMLElement>;
  @ViewChild('carouselPrev') prevBtnRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('carouselNext') nextBtnRef!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    // ViewChild references are resolved after the view initialises.
    // No additional setup needed — click handlers are wired in the template.
  }

  /**
   * Scroll the carousel by half its visible width.
   * Matches the Stitch JS: const scrollAmount = carousel.offsetWidth / 2;
   * The carousel-container CSS class sets scroll-behavior: smooth.
   */
  scrollCarousel(direction: 'prev' | 'next'): void {
    const carousel = this.carouselRef.nativeElement;
    const scrollAmount = carousel.offsetWidth / 2;
    carousel.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }
}

