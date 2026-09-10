import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-overview',
  imports: [RouterLink],
  templateUrl: './service-overview.html',
  styleUrl: './service-overview.css',
})
export class ServiceOverview {
  readonly information = [
    {
      icon: 'check_circle',
      label: 'Issues Covered',
      accent: 'text-primary',
      description: 'Leaking pipes, damaged pipe connections, water seepage, minor pipeline leaks',
    },
    {
      icon: 'schedule',
      label: 'Typical Duration',
      accent: 'text-secondary-fixed',
      description: '30–90 min, depending on pipe material and leak source accessibility',
    },
    {
      icon: 'home_repair_service',
      label: 'Service Type',
      accent: 'text-tertiary',
      description: 'On-site repair, diagnosis and high-pressure pipe fitting inspection',
    },
    {
      icon: 'info',
      label: 'Customer Preparation',
      accent: 'text-primary',
      description: 'Keep the affected area accessible and shut off the local valve if leaking heavily',
    },
  ] as const;
}
