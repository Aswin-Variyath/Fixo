import { Component } from '@angular/core';
import { NavbarComponent } from '../../../landing/components/navbar/navbar.component';
import { FooterComponent } from '../../../landing/components/footer/footer.component';

@Component({
  selector: 'app-signup',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {}
