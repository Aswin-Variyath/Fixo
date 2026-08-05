import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly themeService = inject(ThemeService);
}

