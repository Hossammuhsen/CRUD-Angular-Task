import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {path: '' , redirectTo:'login', pathMatch:'full'},
    {path:'signup' , component:SignupComponent},
    {path:'login' , component:LoginComponent},
    {path:'dashboard' , component:DashboardComponent , canActivate:[AuthGuard]},
];
