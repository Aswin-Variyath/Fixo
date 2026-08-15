import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-home',
  imports: [],
  templateUrl: './customer-home.html',
  styleUrl: './customer-home.css',
})
export class CustomerHome {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router)

    readonly user = this.authService.user;
    logout():void {
      this.authService.logout().subscribe({
        next:() => {
          this.router.navigate(['/login'])
        }
      })
    }
}
