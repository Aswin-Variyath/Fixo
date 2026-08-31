import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators,  } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-signin.html',
  styleUrl: './admin-signin.css',
})
export class AdminSignin {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)

  readonly loginForm = this.fb.nonNullable.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(8)]]
  })

  isLoading = false
  errorMessage = ''

  onSubmit():void {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }
    this.isLoading = true;
    console.log("Admin login data",this.loginForm.getRawValue())
    const request = {
      email:this.loginForm.controls.email.value,
      password:this.loginForm.controls.password.value
    }
    this.authService.adminLogin(request).subscribe({
      next:(res)=> {
        console.log("res",res)
        this.isLoading = false
        this.router.navigate(['/admin/verify-otp'])
      },
      error:(error)=>{
        this.isLoading = false
        this.errorMessage = error?.error?.message ?? 'Unable to sign in. Please try again.'
      }
    })
  }

}
