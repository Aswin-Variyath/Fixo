import { Component } from '@angular/core';
import { NavbarComponent } from '../../landing/customer/home/sections/navbar/navbar.component';
import { FooterComponent } from '../../landing/customer/home/sections/footer/footer.component';

@Component({
  selector: 'app-signup',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {}
