import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { AboutFixo } from './sections/about-fixo/about-fixo';
import { Faq } from './sections/faq/faq';
import { HeroBanner } from './sections/hero-banner/hero-banner';
import { HeroContent } from './sections/hero-content/hero-content';
import { HowToJoin } from './sections/how-to-join/how-to-join';

@Component({
  selector: 'app-become-tasker',
  imports: [Navbar, Footer, AboutFixo, Faq, HeroBanner, HeroContent, HowToJoin],
  templateUrl: './become-a-tasker-landing.html',
  styleUrl: './become-a-tasker-landing.css',
})
export class BecomeTaskerLanding {}
