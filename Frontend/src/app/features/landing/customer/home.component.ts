import { Component } from '@angular/core';
import { TestimonialsComponent } from './home/sections/testimonials/testimonials.component';
import { ServicesComponent } from './home/sections/services/services.component';
import { NavbarComponent } from './home/sections/navbar/navbar.component';
import { HowItWorksComponent } from './home/sections/how-it-works/how-it-works.component';
import { HeroComponent } from './home/sections/hero/hero.component';
import { FooterComponent } from './home/sections/footer/footer.component';
import { BecomeTaskerComponent } from './home/sections/become-tasker/become-tasker.component';

@Component({
  selector: 'app-home',
  imports: [TestimonialsComponent, ServicesComponent,NavbarComponent, HowItWorksComponent,HeroComponent, FooterComponent, BecomeTaskerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeLanding {}
