import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}
  IsLoggedIn(){
    return !!sessionStorage.getItem('token');
  }
  IsLoggedOut(){
    return !!sessionStorage.getItem('toke');
  }
}
