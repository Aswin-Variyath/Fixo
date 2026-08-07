import { Component } from '@angular/core';
import { Navbar } from '../../../landing/components/navbar/navbar';
import { Footer } from '../../../landing/components/footer/footer';

@Component({
  selector: 'app-tasker-signup',
  imports: [Navbar,Footer],
  templateUrl: './tasker-signup.html',
  styleUrl: './tasker-signup.css',
})
export class TaskerSignup {}
