import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate(){
    if(this.auth.IsLoggedOut()==true){
    return false;
  }
  else if(this.auth.IsLoggedIn()==true){
    return true;
  }
    this.router.navigate(['search']);
        return false;}
}
