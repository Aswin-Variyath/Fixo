/**
 * MagneticDirective — appMagnetic
 * --------------------------------
 * Applies the magnetic button effect from the Google Stitch JS:
 *
 *   target.addEventListener('mousemove', (e) => {
 *     const rect = target.getBoundingClientRect();
 *     const x = e.clientX - rect.left - rect.width / 2;
 *     const y = e.clientY - rect.top - rect.height / 2;
 *     target.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
 *   });
 *   target.addEventListener('mouseleave', () => {
 *     target.style.transform = 'translate(0, 0)';
 *   });
 *
 * WHY A DIRECTIVE: The behaviour is purely DOM-interaction-based and reusable.
 * Adding it as a directive means any element in any feature module can opt in
 * simply by adding [appMagnetic] — no parent component changes needed.
 *
 * WHY @HostListener: Angular's recommended way to listen to DOM events on the
 * host element. No manual addEventListener/removeEventListener lifecycle needed.
 *
 * WHY Renderer2: Renderer2 is the Angular-safe abstraction for DOM manipulation.
 * It works correctly in SSR and Web Workers, and does not bypass Angular's
 * change detection model.
 *
 * The CSS transition `transform 0.2s ease-out` on .magnetic-target (defined in
 * _components.css) handles the smooth snap-back on mouseleave.
 */

import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
  host: {
    class: 'magnetic-target',
  },
})
export class MagneticDirective {
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `translate(${x * 0.3}px, ${y * 0.3}px)`,
    );
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      'translate(0, 0)',
    );
  }
}
