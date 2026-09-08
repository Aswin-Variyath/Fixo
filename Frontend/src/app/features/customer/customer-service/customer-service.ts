import { Component } from '@angular/core';
import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { ServicesHeader } from './sections/services-header/services-header';
import { Search } from './sections/search/search';
import { ServiceResults } from './sections/service-results/service-results';

@Component({
  selector: 'app-customer-service',
  imports: [Navbar, Footer, ServicesHeader, Search, ServiceResults],
  templateUrl: './customer-service.html',
  styleUrl: './customer-service.css',
})
export class CustomerService {}
