import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly user = this.authService.user;

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToTaskerSignup(): void {
    this.router.navigate(['/become-a-tasker']);
  }
}
