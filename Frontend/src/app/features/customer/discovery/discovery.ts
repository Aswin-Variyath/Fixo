import { Component, inject } from '@angular/core';
import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Filters } from './sections/filters/filters';
import { TaskerResults } from './sections/tasker-results/tasker-results';
import { DiscoveryHeader } from './sections/discovery-header/discovery-header';
import { DiscoveryLocation } from './services/discovery-location';
import { DiscoveryLocationApi } from './api/discovery-location-api';

@Component({
  selector: 'app-discovery',
  imports: [Footer, Navbar,Filters,TaskerResults, DiscoveryHeader],
  providers: [DiscoveryLocation, DiscoveryLocationApi],
  templateUrl: './discovery.html',
  styleUrl: './discovery.css',
})
export class Discovery {

}
