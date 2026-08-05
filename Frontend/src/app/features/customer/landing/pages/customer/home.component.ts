import { Component } from '@angular/core';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { ServicesComponent } from './sections/services/services.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { HeroComponent } from './sections/hero/hero.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BecomeTaskerComponent } from './sections/become-tasker/become-tasker.component';



@Component({
  selector: 'app-home',
  imports: [TestimonialsComponent, ServicesComponent,NavbarComponent, HowItWorksComponent,HeroComponent, FooterComponent, BecomeTaskerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeLanding {}
