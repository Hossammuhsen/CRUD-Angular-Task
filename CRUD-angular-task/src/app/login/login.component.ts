import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule , SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading:boolean = false
  error:boolean = false
  errorMsg:string = '';
  
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

route = inject(Router);
authService = inject(AuthService)

get emailInputValidation(){
  return this.myForm.get('email')?.touched && this.myForm.get('email')?.invalid
}

get emailrequiredValiation(){
 return this.myForm.get('email')?.errors?.['required']
}

get emailformatValidation(){
  return this.myForm.get('email')?.errors?.['email']
}
get passwordInputValidation(){
  return this.myForm.get('password')?.touched && this.myForm.get('password')?.invalid
}

get passwordrequiredValiation(){
 return this.myForm.get('password')?.errors?.['required']
}

get passwordLengthValidation(){
  return this.myForm.get('password')?.errors?.['minlength']
}
onLogin() {
  if (this.myForm.valid) {
    const user = this.myForm.value;
    this.isLoading = true;

    this.authService.login(user.email, user.password).subscribe({
      next: (users) => {
        if (users.length > 0) {
          console.log('Login successful!');
          localStorage.setItem('user', JSON.stringify(users[0]));
          setTimeout(() => {
            this.isLoading = false;
            this.route.navigate(['dashboard']);
          }, 1000);
        } else {
          console.error('Invalid email or password');
          this.isLoading = false;
          alert('Invalid email or password');
        }
      },
      error: (err) => {
        console.error('Login request failed:');
        this.isLoading = false;
        this.error = true
        this.handleError(err)
        this.myForm.reset()
      },
    });
  } else {
    console.log('Form is invalid!');
    this.myForm.markAllAsTouched();
  }
}

handleError(err:any){
 const errorStauts = err.statusText
  if(errorStauts == "Unknown Error"){
    this.errorMsg = 'Error In Fetching Data'
  }
  //in case I have diff errors I will make it in array and fint in it the error the make a switch case
}

onNvigateToReg():any{
return this.route.navigate(['signup'])
}
}
