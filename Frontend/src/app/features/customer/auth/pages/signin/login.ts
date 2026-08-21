import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../../landing/components/navbar/navbar.component';
import { FooterComponent } from '../../../landing/components/footer/footer.component';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'

@Component({
  selector: 'app-login',
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  readonly loginForm = new FormGroup({
    email: new FormControl('',{
      nonNullable:true, validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('',{
      nonNullable:true,
      validators: [Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]
    })
  })

  isSubmitting:boolean = false
  errorMessage:string = ''

  submit():void {
    console.log('LOGIN SUBMIT CLICKED');
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }
    this.isSubmitting = true
    this.errorMessage = ""
    this.authService.login({...this.loginForm.getRawValue(),role: 'customer'}).subscribe({
      next:() => {
        this.isSubmitting = false;

        this.router.navigate(['/customer/home'],{replaceUrl:true})
      },
      error:(error) => {
        this.isSubmitting = false
        this.errorMessage = error?.error?.message ?? 'Unable to login. Please try again'
      }
    })
  }


}
