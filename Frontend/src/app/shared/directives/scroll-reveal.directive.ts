/**
 * ScrollRevealDirective — appScrollReveal
 * ----------------------------------------
 * Implements the Intersection Observer scroll-reveal behaviour from the
 * Google Stitch JS:
 *
 *   const observer = new IntersectionObserver((entries) => {
 *     entries.forEach(entry => {
 *       if (entry.isIntersecting) {
 *         entry.target.classList.add('opacity-100', 'translate-y-0');
 *         entry.target.classList.remove('opacity-0', 'translate-y-10');
 *       }
 *     });
 *   }, { threshold: 0.1 });
 *
 *   document.querySelectorAll('section').forEach(section => {
 *     section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
 *     observer.observe(section);
 *   });
 *
 * WHY A DIRECTIVE: The behaviour is declarative, self-contained, and reusable.
 * Apply [appScrollReveal] to any <section> (or any element) to enable reveal.
 * The directive manages its own IntersectionObserver lifecycle, observing on
 * init and disconnecting on destroy — no memory leaks.
 *
 * WHY NOT ngAfterViewInit IN EACH COMPONENT: That would require duplicating the
 * same IntersectionObserver setup in every section component. A directive
 * DRYs this out and ensures consistency across all sections.
 *
 * WHY Renderer2: Safe cross-platform DOM class manipulation. Works in SSR.
 *
 * INITIAL CLASSES: The directive adds the hidden state classes (opacity-0,
 * translate-y-10) immediately on construction, so the element starts invisible
 * regardless of what classes the template declares. On intersection, it swaps
 * to the visible state (opacity-100, translate-y-0).
 *
 * The transition is driven by `transition-all duration-1000` which must be
 * present on the host element — the directive adds this automatically.
 */

import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {
    // Set the hidden initial state immediately so elements start invisible.
    // These Tailwind classes must be in the project's stylesheet (they are
    // part of Tailwind v4's default utilities).
    this.renderer.addClass(this.el.nativeElement, 'transition-all');
    this.renderer.addClass(this.el.nativeElement, 'duration-1000');
    this.renderer.addClass(this.el.nativeElement, 'opacity-0');
    this.renderer.addClass(this.el.nativeElement, 'translate-y-10');
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal: add visible classes, remove hidden classes
            this.renderer.addClass(entry.target, 'opacity-100');
            this.renderer.addClass(entry.target, 'translate-y-0');
            this.renderer.removeClass(entry.target, 'opacity-0');
            this.renderer.removeClass(entry.target, 'translate-y-10');

            // Once revealed, stop observing to avoid repeated triggers
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    // Disconnect the observer to prevent memory leaks when the component
    // is destroyed (e.g., route navigation)
    this.observer?.disconnect();
    this.observer = null;
  }
}
