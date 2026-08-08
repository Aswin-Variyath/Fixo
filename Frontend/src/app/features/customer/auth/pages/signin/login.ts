import { Component } from '@angular/core';
import { NavbarComponent } from '../../../landing/components/navbar/navbar.component';
import { FooterComponent } from '../../../landing/components/footer/footer.component';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
