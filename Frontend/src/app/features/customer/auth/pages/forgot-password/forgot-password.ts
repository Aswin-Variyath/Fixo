import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../../../../../core/auth/auth-api.service';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder)
  private readonly authService = inject(AuthService)

  readonly forgotForm = new FormGroup({
    email: new FormControl('',{
      nonNullable:true, validators:[Validators.required,Validators.email]
    })
  })

  onSubmit() {
    if(this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched()
      return
    }
    this.authService.forgotPassword(this.forgotForm.getRawValue()).subscribe({
      next:(res)=>{
        console.log('forgot password response', res)
      },
      error:(err)=>console.log("Forgot password error",err)
    })
  }

}
