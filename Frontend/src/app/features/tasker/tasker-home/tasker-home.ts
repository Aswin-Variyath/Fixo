import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasker-home',
  imports: [],
  templateUrl: './tasker-home.html',
  styleUrl: './tasker-home.css',
})
export class TaskerHome {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  logout():void {
    this.authService.logout().subscribe({
      next:()=>{
        this.router.navigate(["/tasker/login"],{replaceUrl:true})

      },
      error:(error)=>{
        console.error("logout failed",error)
      }
    })
  }
}
