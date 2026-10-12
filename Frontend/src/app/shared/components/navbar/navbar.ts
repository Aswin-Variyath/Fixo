import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
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
  const currentUrl = this.router.url;

  const isTaskerPage =
    currentUrl.startsWith('/become-tasker') ||
    currentUrl.startsWith('/become-a-tasker') ||
    currentUrl.startsWith('/tasker');

    console.log("Current url", currentUrl)

  this.router.navigate([
    isTaskerPage ? '/tasker/login' : '/login',
  ]);
}

  goToSignup(): void {
  const isTaskerPage =
    this.router.url.startsWith('/become-tasker') ||
    this.router.url.startsWith('/tasker');

  this.router.navigate([
    isTaskerPage ? '/tasker/signup' : '/signup',
  ]);
}

  goToTaskerSignup(): void {
  if (this.isTaskerLandingPage()) {
    this.router.navigate(['/']);
    return;
  }

  this.router.navigate(['/become-a-tasker']);
}

  isTaskerLandingPage(): boolean {
  return (
    this.router.url.startsWith('/become-tasker') ||
    this.router.url.startsWith('/become-a-tasker')
  );
}
}
