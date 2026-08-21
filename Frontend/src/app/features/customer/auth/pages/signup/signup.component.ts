import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../../landing/components/navbar/navbar.component';
import { FooterComponent } from '../../../landing/components/footer/footer.component';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { from } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [NavbarComponent, FooterComponent,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  readonly signupForm = new FormGroup(
  {
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),

    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        )
      ]
    }),

    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  },
  {
    validators: (form) => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    }
  }
);

  isSubmitting:boolean = false;
  errorMessage:string = ''

  submit():void {
    console.log("asdfjalsdf",this.signupForm.getRawValue())
    if(this.signupForm.invalid) {
      this.signupForm.markAllAsTouched()
      return
    }
    this.isSubmitting = true
    this.errorMessage = ''

    this.authService.signup(this.signupForm.getRawValue()).subscribe({
      next:()=>{
        this.isSubmitting = false
        this.router.navigate(['/customer/home'],{
          replaceUrl:true
        })
      },
      error:(error)=> {
        this.isSubmitting = false
        this.errorMessage = error?.error?.message ?? 'Unable to create account. please try again'
      }
    })
  }

}
