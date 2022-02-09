import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/model/User';
import { DatabaseServiceService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  hasError = false;

  user: User[] = [];

  constructor(
    private databaseService: DatabaseServiceService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    var userId = sessionStorage.getItem('userId');

    if (userId != null) {
      this.router.navigateByUrl('/search');
    }
  }

  async login() {
    var emailBox = document.getElementById('email') as HTMLInputElement;
    var email = emailBox.value;
    var passwordBox = document.getElementById('password') as HTMLInputElement;
    var password = passwordBox.value;

    this.user = await lastValueFrom(
      this.databaseService.getUserByEmail(email, password)
    );

    sessionStorage.setItem('userId', this.user[0].id);
    sessionStorage.setItem('role', this.user[0].role);
    sessionStorage.setItem(
      'userName',
      this.user[0].userFirstName + ' ' + this.user[0].userLastName
    );
    localStorage.setItem('token',"yayaya");
    window.location.reload();
  }
}
