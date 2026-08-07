import { Component } from '@angular/core';
import { Navbar } from '../../../landing/components/navbar/navbar';
import { Footer } from '../../../landing/components/footer/footer';

@Component({
  selector: 'app-tasker-login',
  imports: [Navbar, Footer],
  templateUrl: './tasker-login.html',
  styleUrl: './tasker-login.css',
})
export class TaskerLogin {}
