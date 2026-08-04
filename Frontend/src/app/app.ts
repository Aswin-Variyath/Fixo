import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeLanding } from './features/landing/customer/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HomeLanding],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');
}
