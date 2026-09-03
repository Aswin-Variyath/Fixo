import { Component } from '@angular/core';
import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Filters } from './sections/filters/filters';
import { TaskerResults } from './sections/tasker-results/tasker-results';
import { DiscoveryHeader } from './sections/discovery-header/discovery-header';

@Component({
  selector: 'app-discovery',
  imports: [Footer, Navbar,Filters,TaskerResults, DiscoveryHeader],
  templateUrl: './discovery.html',
  styleUrl: './discovery.css',
})
export class Discovery {}
