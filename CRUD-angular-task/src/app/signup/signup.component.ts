import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule ,ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule ,ReactiveFormsModule , SpinnerComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  isLoading:boolean = false
  error:boolean = false
  errorMsg:string = '';
  signUpForm: FormGroup 

  constructor(private fb:FormBuilder){
    this.signUpForm = this.fb.group({
      name: ['' , [Validators.required]],
      email: ['' , [Validators.required , Validators.email]] ,
      password: ['' , [Validators.required , Validators.minLength(6)]]
    })
  }

route = inject(Router)
authService = inject(AuthService)

get nameInputValidation(){
  return this.signUpForm.get('name')?.touched && this.signUpForm.get('name')?.invalid
}

get emailInputValidation(){
  return this.signUpForm.get('email')?.touched && this.signUpForm.get('email')?.invalid
}

get emailrequiredValiation(){
 return this.signUpForm.get('email')?.errors?.['required']
}

get emailformatValidation(){
  return this.signUpForm.get('email')?.errors?.['email']
}
get passwordInputValidation(){
  return this.signUpForm.get('password')?.touched && this.signUpForm.get('password')?.invalid
}

get passwordrequiredValiation(){
 return this.signUpForm.get('password')?.errors?.['required']
}

get passwordLengthValidation(){
  return this.signUpForm.get('password')?.errors?.['minlength']
}

onRegister() {
  if (this.signUpForm.valid) {
    const user = this.signUpForm.value;
    this.isLoading = true;

    this.authService.login(user.email, user.password).subscribe({
      next: (existingUsers) => {
        if (existingUsers.length > 0) {
          alert('Email already in use!');
          this.isLoading = false; 
        } else {
          this.authService.signup(user).subscribe({
            next: () => {
              localStorage.setItem('user', JSON.stringify(user));
              setTimeout(() => {
                this.isLoading = false;
                this.route.navigate(['dashboard']);
              }, 1000);
            },
            error: (error) => {
              console.error('Signup failed:', error);
              this.isLoading = false; 
              alert('An error occurred during signup. Please try again.');
            }
          });
        }
      },
      error: (err) => {
        console.error('Email check failed:', err);
        this.isLoading = false; 
        this.error = true
        this.handleError(err)
        this.signUpForm.reset()
      }
    });
  } else {
    console.log('Form is invalid');
    this.signUpForm.markAllAsTouched();
  }
}

handleError(err:any){
  const errorStauts = err.statusText
   if(errorStauts == "Unknown Error"){
     this.errorMsg = 'Error In Fetching Data'
   }
   //in case I have diff errors I will make it in array and fint in it the error the make a switch case
   //ToDo
   //all errors will be handled form error service 
 }

onNvigateToLogin(){
this.route.navigate(['login'])
}
}