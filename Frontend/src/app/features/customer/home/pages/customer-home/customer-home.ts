import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-customer-home',
  imports: [],
  templateUrl: './customer-home.html',
  styleUrl: './customer-home.css',
})
export class CustomerHome {
  private readonly authService = inject(AuthService);

    readonly user = this.authService.user;
}
