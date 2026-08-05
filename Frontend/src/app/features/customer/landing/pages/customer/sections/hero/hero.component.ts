import { Component } from '@angular/core';
import { MagneticDirective } from '../../../../../../../shared/directives/magnetic.directive';
import { ScrollRevealDirective } from '../../../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-hero',
  imports: [MagneticDirective, ScrollRevealDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {}

