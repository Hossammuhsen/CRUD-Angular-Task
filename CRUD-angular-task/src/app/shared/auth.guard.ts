import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  GuardResult,
  MaybeAsync
} from '@angular/router';
import { AuthService } from './shared/auth.service';
import { BlobOptions } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 authService= inject(AuthService);
 route = inject(Router)


 canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean {
  if (this.authService.isLoggedIn()) {
    return true;
  } else {
    this.route.navigate(['login']); 
    return false;
  }
}

}
