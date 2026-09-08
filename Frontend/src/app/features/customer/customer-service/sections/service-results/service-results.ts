import { Component } from '@angular/core';

@Component({
  selector: 'app-service-results',
  imports: [],
  templateUrl: './service-results.html',
  styleUrl: './service-results.css',
})
export class ServiceResults {
  readonly services = [
    {
      id: 1,
      title: 'Tap Repair',
      description: 'Repair leaking, noisy, or damaged taps, mixer faucets, and valve replacements in your home.',
      icon: 'water_drop',
    },
    {
      id: 2,
      title: 'Pipe Leakage Repair',
      description: 'Detection and fix for concealed wall pipes, drain pipes, and burst water pipeline issues.',
      icon: 'plumbing',
    },
    {
      id: 3,
      title: 'Bathroom Plumbing',
      description: 'Complete installation and servicing for showers, flush tanks, washbasins, and commodes.',
      icon: 'shower',
    },
    {
      id: 4,
      title: 'Water Tank Installation',
      description: 'Overhead and underground water tank fitting, inlet/outlet piping, and float ball setup.',
      icon: 'propane_tank',
    },
    {
      id: 5,
      title: 'Drain Unblocking',
      description: 'Clearing clogged kitchen sinks, floor drains, bathroom traps, and main sewer line blockages.',
      icon: 'sanitizer',
    },
    {
      id: 6,
      title: 'Water Pump & Motor Repair',
      description: 'Troubleshooting submersible pumps, pressure boosters, capacitor failures, and noisy motors.',
      icon: 'settings_input_component',
    },
  ];
}
