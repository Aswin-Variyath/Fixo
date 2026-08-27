import { Component, inject } from '@angular/core';
import { Navbar } from '../../../landing/components/navbar/navbar';
import { Footer } from '../../../../../shared/components/footer/footer';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { SignupRequest } from '../../../../../core/auth/auth.types';

@Component({
  selector: 'app-tasker-signup',
  imports: [Navbar,Footer, ReactiveFormsModule],
  templateUrl: './tasker-signup.html',
  styleUrl: './tasker-signup.css',
})
export class TaskerSignup {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  readonly signupForm = new FormGroup({
    firstName:new FormControl('',{
      nonNullable:true,
      validators:[Validators.required]
    }),
    lastName:new FormControl('',{
      nonNullable:true,
      validators:[Validators.required]
    }),
    email: new FormControl('',{
      nonNullable:true,
      validators:[Validators.required,Validators.email]
    }),
    phone:new FormControl('',{
      nonNullable:true,
      validators:[Validators.required]
    }),
    password:new FormControl('',{
      nonNullable:true,
      validators:[Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]
    }),
    confirmPassword:new FormControl('',{
      nonNullable:true,
      validators:[Validators.required]
    })
  },{
    validators: (form) => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    }
  })


  isSubmitting:boolean = false
  errorMessage:string = ''

  submit():void {
    if(this.signupForm.invalid) {
      this.signupForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    this.errorMessage = ''

    const formValue = this.signupForm.getRawValue();

    const signupRequest: SignupRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password
    };
    this.authService.signupTasker(signupRequest).subscribe({
      next:()=>{
        this.isSubmitting = false
        this.router.navigate(['/tasker/home'],{replaceUrl:true})
      },
      error:(error) => {
        this.isSubmitting = false
        this.errorMessage = error?.error?.message ?? "Unable to signup. please try again"
      }
    })
    
  }
}
