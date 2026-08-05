import { Component } from '@angular/core';
import { NavbarComponent } from '../../../landing/customer/home/sections/navbar/navbar.component';
import { FooterComponent } from '../../../landing/customer/home/sections/footer/footer.component';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
