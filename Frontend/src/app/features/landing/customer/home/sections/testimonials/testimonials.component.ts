import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-testimonials',
  imports: [ScrollRevealDirective],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
})
export class TestimonialsComponent {}

