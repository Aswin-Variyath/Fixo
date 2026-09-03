import { Component } from '@angular/core';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { ServicesComponent } from './sections/services/services.component';
import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { HeroComponent } from './sections/hero/hero.component';
import { BecomeTaskerComponent } from './sections/become-tasker/become-tasker.component';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';



@Component({
  selector: 'app-home',
  imports: [TestimonialsComponent, ServicesComponent,Navbar, HowItWorksComponent,HeroComponent, Footer, BecomeTaskerComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class HomeLanding {}
